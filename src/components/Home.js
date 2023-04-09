import React, { useEffect, useState } from "react";
import axios from 'axios';
import { message, Tabs } from 'antd';
import SearchBar from "./SearchBar";
import {SEARCH_KEY, BASE_URL, TOKEN_KEY} from '../constants'

const { TabPane} = Tabs;
function Home(props) {
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: "",
    })
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    useEffect( () => {
//do search for the first time -> didMount -> search: {type : all, value:""}
        //after the first time -> didUpdate -> search: {type: keyword/user, value:val}
        fetchPost(searchOption)
    }, [searchOption] )
    const fetchPost = option => {
        //1.get searchType and searchValue
        //2. send search request to the server
        //3. get response from the server
        // case 1 : success -> pass posts to the gallery
        // case 2 fail -> inform user
        const {type, keyword} = option;
        let url = "";
        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }
        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        }
        axios(opt)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setPosts(res.data);
                }
            })
            .catch( err => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            })
    }
    const operation = <Button>upload</Button>
    return (
        <div className="home">
            <SearchBar />
            <div className="display">
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;