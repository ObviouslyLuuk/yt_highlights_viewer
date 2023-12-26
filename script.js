
const PEAK_BOUNDS = [-3, 3];


const video_elem = document.querySelector("video");

function get_thumbnail_url(video_id) {
    return `https://i.ytimg.com/vi_webp/${video_id}/mqdefault.webp`;
};
function format_views(views) {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function load_video(url) {
    video_elem.src = url;
};
function put_video_info(idx, video_object) {
    let rank_elem = document.querySelector("#rank");
    let views_elem = document.querySelector("#viewcount");
    let ago_date_elem = document.querySelector("#ago-date");
    let upload_date_elem = document.querySelector("#upload-date");
    let thumb_elem = document.querySelector("#thumb-img");
    let title_elem = document.querySelector("#title-div");
    let channel_elem = document.querySelector("#channel-div");

    rank_elem.innerHTML = Object.keys(selected_videos).length - idx;
    views_elem.innerHTML = format_views(video_object.views);
    ago_date_elem.innerHTML = video_object.ago_date;
    let published = new Date(video_object.exact_dict.published);
    // We want to format the date like this: (Jan 1, 2023)
    let month = published.toLocaleString('default', { month: 'short' });
    let day = published.getDate();
    let year = published.getFullYear();
    upload_date_elem.innerHTML = `(${month} ${day}, ${year})`;
    thumb_elem.src = get_thumbnail_url(video_object.id);
    title_elem.innerHTML = video_object.title;
    channel_elem.innerHTML = video_object['channel_@name'];
};

function load_highlight(idx) {
    let video_object = Object.values(selected_videos)[idx];
    put_video_info(idx, video_object);
    console.log(video_object);
    let url = video_object.download_urls[0][1].url;
    load_video(url);
    let t = video_object.peak_time;
    video_elem.currentTime = t/1000 + PEAK_BOUNDS[0];
    video_elem.play();
}


var idx = 0;
function initPage() {
    // if idx in url params, use that
    let current_url = new URL(window.location.href);
    let params = new URLSearchParams(current_url.search);
    if (params.has("idx")) {
        idx = parseInt(params.get("idx"));
    } else {
        // Add idx to url params
        idx = 0;
        window.history.replaceState({}, document.title, "?idx=" + idx);
    };
    load_highlight(idx);
};
initPage();


function switch_video(change) {
    load_highlight(idx+change);
    video_elem.play();
    idx += change;
    window.history.pushState({}, document.title, "?idx=" + idx);
}


// Add event listener for time update
video_elem.addEventListener("timeupdate", function() {
    handleTimeUpdate();
});


function handleTimeUpdate() {
    let video_object = Object.values(selected_videos)[idx];
    if (video_elem.currentTime > video_object.peak_time/1000 + PEAK_BOUNDS[1]) {
        // switch_video(1);
        // video_elem.pause();
        // Prevent controls from showing
        video_elem.controls = false;
        video_elem.currentTime = video_object.peak_time/1000 + PEAK_BOUNDS[0];
    }
}
video_elem.addEventListener("mouseover", function() {
    video_elem.controls = true;
});


window.addEventListener("popstate", initPage);

const back_button = document.querySelector("#prev-btn");
const next_button = document.querySelector("#next-btn");
back_button.addEventListener("click", function() {
    switch_video(-1);
});
next_button.addEventListener("click", function() {
    switch_video(1);
});

