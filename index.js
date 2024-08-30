import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let user ;
document.getElementById('viet').addEventListener('click',()=>{
    user = {name:'Viet', id:'viet4b161eee-c0f5-4545-9c4b-8562944223ee'}
    document.getElementById('twimba-app').style.display ='block'
    document.getElementById('select-name').style.display = 'none';
    const tweetManager = new TweetManager(tweetsData, user);
tweetManager.render();
})
document.getElementById('trang').addEventListener('click',()=>{
   user = {name:'Trang', id:'trang4b161eee-c0f5-4545-9c4b-8562944223ee'}
   document.getElementById('twimba-app').style.display ='block'
   document.getElementById('select-name').style.display = 'none';
   const tweetManager = new TweetManager(tweetsData, user);
tweetManager.render();
})



class TweetManager {
    constructor(tweets,user) {
        this.name = user.name;
        this.id = user.id
        this.tweets = tweets;
        this.channel = new BroadcastChannel('example_channel');
        this.channel.onmessage = (event) => {
            this.updateFromChannel(event.data);
        };
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.like) {
                this.handleLikeClick(e.target.dataset.like);
            } else if (e.target.dataset.retweet) {
                this.handleRetweetClick(e.target.dataset.retweet);
            } else if (e.target.dataset.reply) {
                this.handleReplyClick(e.target.dataset.reply);
            } else if (e.target.id === 'tweet-btn') {
                this.handleTweetBtnClick();
            } else if (e.target.dataset.btnreply) {
                this.handleClickReply(e.target.dataset.btnreply);
            } else if (e.target.dataset.btndeletereply) {
                this.handleClickReplyDelete(e.target.dataset.btndeletereply, e.target.id);
            } else if (e.target.dataset.btndeletepost) {
                this.handleClickDeletePost(e.target.dataset.btndeletepost);
            }
        });
    }

    updateFromChannel(data) {
        this.tweets = data;
        this.render();
    }

    broadcastUpdate() {
        this.channel.postMessage(this.tweets);
    }

    handleClickDeletePost(tweetId) {
        this.tweets = this.tweets.filter(item => item.uuid !== tweetId);
        this.render();
        this.broadcastUpdate();
    }

    handleClickReplyDelete(tweetId, replyId) {
        const targetTweet = this.tweets.find(tweet => tweet.uuid === tweetId);
        if (targetTweet) {
            targetTweet.replies = targetTweet.replies.filter(reply => reply.idreply !== replyId);
            this.render();
            this.broadcastUpdate();
        }
    }

    handleClickReply(tweetId) {
        const targetTweet = this.tweets.find(tweet => tweet.uuid === tweetId);
        if (targetTweet) {
            targetTweet.replies.push({
                handle: this.name,
                profilePic: 'images/scrimbalogo.png',
                tweetText: document.getElementById(tweetId).value,
                idreply: uuidv4()
            });
            targetTweet.retweets++;
            this.render();
            this.broadcastUpdate();
        }
    }

    handleLikeClick(tweetId) {
        const targetTweet = this.tweets.find(tweet => tweet.uuid === tweetId);
        if (targetTweet) {
            if(targetTweet.likes.includes(this.name)){
                targetTweet.likes = targetTweet.likes.filter(item => item !== this.name);
            } else {
                targetTweet.likes.push(this.name);
            }
           
            this.render();
            this.broadcastUpdate();
        }
    }
    

    handleRetweetClick(tweetId) {
        const targetTweet = this.tweets.find(tweet => tweet.uuid === tweetId);
        if (targetTweet) {
            targetTweet.isRetweeted ? targetTweet.retweets-- : targetTweet.retweets++;
            targetTweet.isRetweeted = !targetTweet.isRetweeted;
            this.render();
            this.broadcastUpdate();
        }
    }

    handleReplyClick(replyId) {
        document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
    }

    handleTweetBtnClick() {
        const tweetInput = document.getElementById('tweet-input');
        if (tweetInput.value) {
            this.tweets.unshift({
                handle: this.name,
                profilePic: 'images/scrimbalogo.png',
                likes: [],
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: this.name +uuidv4(),
                post: `mypost-${this.name}`
            });
            this.render();
            this.broadcastUpdate();
            tweetInput.value = '';
        }
    }

    getFeedHtml() {
        document.getElementById('header-twimba').innerHTML = `<img src="images/scrimbalogo.png" class="profile-pic">
			<textarea placeholder= " ${this.name}'s happening?" id="tweet-input"></textarea>`
        return this.tweets.map(tweet => {
            let likeIconClass = tweet.likes.includes(this.name) ? 'liked' : '';
            let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';
            let repliesHtml = tweet.replies.map(reply => {
                let replyHidden = reply.handle === this.name ? 
                    `<i class="fa-solid fa-trash" data-btndeletereply="${tweet.uuid}" id="${reply.idreply}"></i>` : '';
                return `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                            ${replyHidden}
                        </div>
                    </div>`;
            }).join('');
            
            repliesHtml += `
                <div class="tweet-inner">
                    <img class="profile-pic" src="images/scrimbalogo.png">
                    <input class='input-text' placeholder="Reply" type="text" id="${tweet.uuid}">
                    <button class="btn-reply" data-btnreply="${tweet.uuid}">Reply</button>
                </div>`;

            let deletePostButton = tweet.handle === this.name ? 
                `<i class="fa-solid fa-trash" data-btndeletepost="${tweet.uuid}"></i>` : '';

            return `
                <div class="tweet">
                    <div class="tweet-inner">
                        <img src="${tweet.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                    ${tweet.replies.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                    ${tweet.likes.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                    ${tweet.retweets}
                                </span>
                            </div>   
                        </div>  
                        ${deletePostButton}        
                    </div>
                    <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                    </div>   
                </div>`;
        }).join('');
    }

    render() {
        document.getElementById('feed').innerHTML = this.getFeedHtml();
    }
}

// Khởi tạo lớp TweetManager với dữ liệu tweets




