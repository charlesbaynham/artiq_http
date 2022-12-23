
export function make_query_url(endpoint, params) {
    var url = new URL(`/${endpoint}`, "http://localhost:8000")

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    return url;
}

export function cancel_rid(rid, force = false) {
    fetch(make_query_url("cancel", { rid: rid, force: force }), {
        method: "POST",
    })
        .then((response) => response.json())
        .catch((err) => {
            console.log(err.message);
        });
}

export function update_schedule(callback) {
    fetch('http://localhost:8000/schedule')
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export default null;
