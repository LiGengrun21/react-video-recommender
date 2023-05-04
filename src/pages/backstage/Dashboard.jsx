import { useLocation } from 'react-router-dom';

function Dashboard(){
    const location = useLocation();
    const { data } = location.state;
    return(
        <div>
            管理系统控制台{data}
        </div>
    )
}

export default Dashboard;