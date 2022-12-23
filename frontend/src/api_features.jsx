
const isDev = process.env.NODE_ENV !== 'production';
const baseURL = isDev ? "http://localhost:8000" : window.location.origin

export function make_query_url(endpoint, params = {}) {
    var url = new URL(endpoint, baseURL)

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    return url;
}

export function cancel_rid(rid, force = false) {
    fetch(make_query_url("api/cancel", { rid: rid, force: force }), {
        method: "POST",
    })
        .then((response) => response.json())
        .catch((err) => {
            console.log(err.message);
        });
}

export function queue_experiment(file, class_name, repo_rev, args = {}, callback = null) {
    const expid = {
        "log_level": 30,
        "file": file,
        "class_name": class_name,
        "arguments": args,
        "repo_rev": repo_rev
    }

    const body = JSON.stringify(expid)

    fetch(make_query_url("api/schedule", {}), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
        .then((response) => response.json())
        .then((data) => {
            if (callback) {
                callback(data)
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export function update_schedule(callback) {
    fetch(make_query_url("api/schedule", {}))
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export function update_explist(callback) {
    fetch(make_query_url("api/explist", {}))
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export default null;
