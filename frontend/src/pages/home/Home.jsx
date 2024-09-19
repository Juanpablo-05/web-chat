import AsideBar from '../../components/user/AsideBar';
import { Outlet } from 'react-router-dom';
import '../../styles/user/Home_module.css'

function Home() {

    return (
        <div className='container_home'>
            <div className="container_element">
                <div className="container_setting">
                    <h3>settings</h3>
                </div>
                <AsideBar/>
                <Outlet />
            </div>
        </div>
    );
}


export default Home