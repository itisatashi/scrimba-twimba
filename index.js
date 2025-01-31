import {tweetsData as defaultTweetsData} from "./data.js";
import {v4 as uuidv4} from "https://jspm.dev/uuid";

// Load tweets from localStorage or default data
let tweetsData =
    JSON.parse(localStorage.getItem("tweetsData")) || defaultTweetsData;

// Event Listener for Click Events
document.addEventListener("click", function (e) {
    const {
        like,
        retweet,
        reply,
        replyBtnToTweet,
        delete: deleteTweet,
    } = e.target.dataset;

    if (like) handleLikeClick(like);
    else if (retweet) handleRetweetClick(retweet);
    else if (reply) handleReplyClick(reply);
    else if (e.target.id === "tweet-btn") handleTweetBtnClick();
    else if (replyBtnToTweet) handleReplyBtnToTweet(replyBtnToTweet);
    else if (deleteTweet) handleDeleteClick(deleteTweet);
});

// Like Button Handler
function handleLikeClick(tweetId) {
    const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
    if (!tweet) return;

    tweet.isLiked = !tweet.isLiked;
    tweet.likes += tweet.isLiked ? 1 : -1;
    render();
}

// Retweet Button Handler
function handleRetweetClick(tweetId) {
    const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
    if (!tweet) return;

    tweet.isRetweeted = !tweet.isRetweeted;
    tweet.retweets += tweet.isRetweeted ? 1 : -1;
    render();
}

// Reply Button Handler
function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
    document
        .getElementById(`tweet-reply-${replyId}`)
        .classList.toggle("hidden");
}

// New Tweet Submission
function handleTweetBtnClick() {
    const tweetInput = document.getElementById("tweet-input");
    if (!tweetInput.value) return;

    tweetsData.unshift({
        handle: "@Scrimba",
        profilePic: "images/scrimbalogo.png",
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    });

    render();
    tweetInput.value = "";
}

// Reply to a Tweet Handler
function handleReplyBtnToTweet(replyId) {
    const tweetReplyInput = document.querySelector(
        `#tweet-reply-${replyId} .tweet-reply-input`
    );
    if (!tweetReplyInput.value) return;

    const tweet = tweetsData.find((tweet) => tweet.uuid === replyId);
    if (!tweet) return;

    tweet.replies.push({
        handle: "@atashi 💎",
        profilePic: "images/scrimbalogo.png",
        tweetText: tweetReplyInput.value,
    });

    render();
    tweetReplyInput.value = "";
}

// Delete Tweet Handler
function handleDeleteClick(tweetId) {
    tweetsData = tweetsData.filter((tweet) => tweet.uuid !== tweetId);
    render();
}

// Generate HTML for Tweets
function getFeedHtml() {
    return tweetsData
        .map((tweet) => {
            const likeClass = tweet.isLiked ? "liked" : "";
            const retweetClass = tweet.isRetweeted ? "retweeted" : "";
            const repliesHtml = tweet.replies
                .map(
                    (reply) => `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
            </div>
        `
                )
                .join("");

            return `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <div class="handle-and-delete">
                        <p class="handle">${tweet.handle}</p>
                        <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                    </div>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i> ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i> ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i> ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">${repliesHtml}</div>
            <div id="tweet-reply-${tweet.uuid}" class="tweet-reply-to-tweet hidden">
                <textarea placeholder="Reply to ${tweet.handle}" class="tweet-reply-input"></textarea>
                <button data-reply-btn-to-tweet="${tweet.uuid}" class="replyBtn-to-tweet">Send</button>
            </div>   
        </div>`;
        })
        .join("");
}

// Render the Feed
function render() {
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
