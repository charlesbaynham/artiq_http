import React from 'react';


function Schedule() {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:8000')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPosts(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    let buildList = () => {
        return <>
            {
                posts.map((post, ind) => { return <li key={ind}>{post.title}</li> }
                )
            }
        </>
    }

    return (
        <>
            <p>This is the schedule of what's up:</p>
            {buildList()}
        </>
    )
}

export default Schedule;
