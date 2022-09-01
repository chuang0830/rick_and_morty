import { useEffect,useState } from 'react';
import { useQuery, gql, } from '@apollo/client';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const GET_LIST = gql`
  query GetList {
    characters {
        results {
        image
          name
          created
          gender
        }
      }
    }
`;



const CharacterList=()=>{
    const [name, setName] = useState(false);
    const [gender, setGender] = useState(false);
    const [created, setCreated] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [PerPage] = useState(10);
    const [ content, setContent ]=useState([])
    const [ display, setDisplay ]=useState([])
    const [ searchInput, setSearchInput ]=useState('')
    const [ order, setOrder ]=useState('ASC')
    const { loading, error, data } = useQuery(GET_LIST);

    const sorting = (key) =>{
            if(order==='ASC'){
                const sorted = [...content].sort((a,b)=>
                a[key].toLowerCase() >  b[key].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('DSC')
            }
            if(order==='DSC'){
                const sorted = [...content].sort((a,b)=>
                a[key].toLowerCase() <  b[key].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('ASC')
            }
     }
    
     const filterFun = () =>{
        const filterdata =data.characters.results.filter(item=>
            item.name.toLowerCase().includes(searchInput.toLowerCase())||
            item.gender.toLowerCase().includes(searchInput.toLowerCase())||
            item.created.toLowerCase().includes(searchInput.toLowerCase()))
            setContent(filterdata)  
     }

    useEffect(()=>{
        if(data){
            setContent(data.characters.results)
            filterFun()
        }
    },[data,searchInput])
    useEffect(() => {
        const ContentDisplay = content
        const startPerPage = currentPage *PerPage
        const endPerPage = PerPage+startPerPage
        setDisplay(ContentDisplay.slice(startPerPage,endPerPage))
      }, [content,currentPage])

    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error :(</p>;
    return(
        
        <div className='container'>
            <div className='hero_section'>
                <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--sy4EkUcy--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ksq0lckoen89nql30g1x.jpeg" alt="" />
            </div>
            <input type="text" placeholder='Search...' onChange={e=>setSearchInput(e.target.value)}/>
            <table>
                <thead>
                    <tr>
                        <th>
                            Avatar
                        </th>
                        <th onClick={()=>{ sorting('name');setName(!name) }}>
                            Name
                            {name?<AiFillCaretUp/>:<AiFillCaretDown/>} 
                        </th>
                        <th onClick={()=>{sorting('gender');setGender(!gender)}}>
                            gender
                            {gender?<AiFillCaretUp/>:<AiFillCaretDown/>} 
                        </th>
                        <th onClick={()=>{sorting('created');setCreated(!created)}}>
                            created
                            {created?<AiFillCaretUp/>:<AiFillCaretDown/>} 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {display&&display.length>0&&display.map(({ image, name, created, gender },i) =>{
                        const format_date = created.substr(0, 10).replaceAll('-','/')
                        return(
                            <tr key={i}>
                                <td className='td_img'><img src={image} alt={name} /></td>
                                <td>{name}</td>
                                <td>{gender}</td>
                                <td>{format_date}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='page'>
                <button disabled={!currentPage} onClick={()=>setCurrentPage(currentPage-1)}>上一頁</button>
                <p> Page {currentPage+1}</p>
                <button disabled={display.length<PerPage} onClick={()=>setCurrentPage(currentPage+1)}>下一頁</button>
            </div>
        </div>
    )
}
export default CharacterList