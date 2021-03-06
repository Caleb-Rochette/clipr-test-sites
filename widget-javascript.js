console.log('here')
var appSyncURL = "https://lo624wnjgbd2fltofinhopkuxe.appsync-api.us-east-1.amazonaws.com/graphql"
document.getElementById('searchField').addEventListener('input', searchClipr)
var myHeaders = new Headers();
myHeaders.append("Authorization", appSyncToken);
myHeaders.append("Content-Type", "application/json");
function searchClipr() {
    console.log('search updated')
    videoList = document.getElementById('videoList')
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild)
    }
    while (topicList.firstChild) {
        topicList.removeChild(topicList.firstChild)
    }
    while (momentList.firstChild) {
        momentList.removeChild(momentList.firstChild)
    }

    console.log(myHeaders)
    searchQuery = document.getElementById('searchField').value
    var graphqlJobSearch = JSON.stringify({
        query: "query MyQuery {\n  getJobs(filter: {_search: \"" + searchQuery + "\", teamId: \"577480a7-235d-47db-a338-1445a529b4bf\"}, first: 20) {\n    edges {\n      node {\n        id\n        title\n        status\n        poster(sizes: {height: 72, width: 128}) {\n          url\n        }\n      }\n    }\n  }\n}\n\n",
        variables: {}
    })
    var graphqlTopicSearch = JSON.stringify({
        query: "query MyQuery {\n  searchMoments(filter: {teamId: \"577480a7-235d-47db-a338-1445a529b4bf\", _search: \"" + searchQuery + "\", clipType: {eq: \"Topic\"}}) {\n    edges {\n      node {\n        clipType\n        description\n        name\n        momentType\n        thumbnail(sizes: {height: 72, width: 128}) {\n          url\n        }\n        id\n        job {\n          id\n          status\n          title\n        }\n      }\n    }\n  }\n}\n\n\n",
        variables: {}
    })
    var graphqlMomentSearch = JSON.stringify({
        query: "query MyQuery {\n  searchMoments(filter: {teamId: \"577480a7-235d-47db-a338-1445a529b4bf\", _search: \"" + searchQuery + "\", clipType: {ne: \"Topic\"}}) {\n    edges {\n      node {\n        clipType\n        description\n        name\n        momentType\n        thumbnail(sizes: {height: 72, width: 128}) {\n          url\n        }\n        id\n        job {\n          id\n          status\n          title\n        }\n      }\n    }\n  }\n}\n\n\n",
        variables: {}
    })
    dataJobSearch = {
        method: 'POST',
        headers: myHeaders,
        body: graphqlJobSearch,
        redirect: 'follow'
    }
    dataTopicSearch = {
        method: 'POST',
        headers: myHeaders,
        body: graphqlTopicSearch,
        redirect: 'follow'
    }
    dataMomentSearch = {
        method: 'POST',
        headers: myHeaders,
        body: graphqlMomentSearch,
        redirect: 'follow'
    }
    fetch(appSyncURL, dataJobSearch)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            data = JSON.parse(result)['data']['getJobs']['edges']
            data.forEach(video => {
                video = video.node
                var thumbUrl = video.poster[0].url
                if (video.status != "InProgress") {
                    var newButton = document.createElement("BUTTON")
                    newButton.innerHTML = "<p style='width: 60%; float: left'><b>" + video.title + "</b></p><img src='" + thumbUrl + "' style='float: left'></img>"
                    newButton.onclick = function () {
                        openPlayer(video.id, '0')
                    }
                    newButton.style = "width: 49%; height: 100px; padding: 5px; float: left"
                    document.getElementById('videoList').appendChild(newButton)
                }
            });
        })
        .catch(error => console.log('error', error))
    fetch(appSyncURL, dataTopicSearch)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            data = JSON.parse(result)['data']['searchMoments']['edges']
            data.forEach(topic => {
                topic = topic.node
                var job = topic.job
                var thumbUrl = topic.thumbnail[0].url
                console.log(thumbUrl)
                if (job.status != "InProgress") {
                    var newButton = document.createElement("BUTTON")
                    console.log(topic)
                    newButton.innerHTML = "<p style='width: 60%; float: left'><b>" + job.title + '</b><br><b>Topic</b><br>' + topic.name + "</p><img src='" + thumbUrl + "' style='float: left'></img>"
                    console.log(newButton.innerHTML)
                    newButton.onclick = async function () {
                        startTime = await getStartTime(topic, job)
                        openPlayer(job.id, startTime)
                    }
                    newButton.style = "width: 49%; height: 100px; padding: 5px; float: left"
                    document.getElementById('topicList').appendChild(newButton)
                }
            })
        })
        .catch(error => console.log(error))
    fetch(appSyncURL, dataMomentSearch)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            data = JSON.parse(result)['data']['searchMoments']['edges']
            data.forEach(moment => {
                moment = moment.node
                var job = moment.job
                console.log(job.title)
                var thumbUrl = moment.thumbnail[0].url
                if (job.status != "InProgress") {
                    var newButton = document.createElement("BUTTON")
                    newButton.innerHTML = "<p style='width: 60%; float: left'><b>" + job.title + '</b><br><b>' + moment.clipType + '</b><br>' + moment.description.substring(0, 50) + "</p><img src='" + thumbUrl + "' style='float: left'></img>"
                    newButton.onclick = async function () {
                        startTime = await getStartTime(moment, job)
                        openPlayer(job.id, startTime)
                    }
                    newButton.style = "width: 49%; height: 100px; padding: 5px; float: left"
                    document.getElementById('momentList').appendChild(newButton)
                }
            })
        })
        .catch(error => console.log(error))

}

async function getStartTime(topic, job) {
    var graphqlGetMoments = JSON.stringify({
        query: "query MyQuery {\n  getMoments(jobId: \"" + job.id + "\") {\n    edges {\n      node {\n        id\n        startTime\n  clipType\n  name\n    description\n  }\n    }\n  }\n}\n\n\n",
        variables: {}
    })
    dataGetMoments = {
        method: 'POST',
        headers: myHeaders,
        body: graphqlGetMoments,
        redirect: 'follow'
    }
    result = await fetch(appSyncURL, dataGetMoments)
        .then(response => response.text())
    //console.log(result)
    data = JSON.parse(result)['data']['getMoments']['edges']
    var i;
    search = document.getElementById("searchField").value
    for (i = 0; i < data.length; i++) {
        moment = data[i].node
        if (moment.clipType == "Topic" && moment.description.includes(search)) {
            console.log(moment.description)
        }
        if (topic.id == moment.id) {
            startTime = moment.startTime
            break
        }
    }
    return startTime


}

function openPlayer(jobId, startTime) {
    vidPlayer = document.getElementById('video-player')
    vidPlayer.style.display = 'inline'
    vidPlayer.src = 'https://staging.cliprai.dev/widget/' + jobId + '?autoplay=false&time=' + startTime + '&cust=polyi'
    console.log(vidPlayer.src)
    console.log(jobId)
}