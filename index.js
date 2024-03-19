import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';



document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.btnreply){
        handleclickReply(e.target.dataset.btnreply)
    }
    else if(e.target.dataset.btndeletereply){
        handleClickReplyDelete(e.target.dataset.btndeletereply,e.target.id)
    }
    else if(e.target.dataset.btndeletepost){
        handleClickDeletePost(e.target.dataset.btndeletepost)
    }
})

function handleClickDeletePost(tweetId){
    tweetsData.forEach(function(item, index){
        if(item.uuid == tweetId){
            tweetsData.splice(index,1)

        }
    })
    render(tweetsData)
}

function handleClickReplyDelete(tweetId,b){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]  
    targetTweetObj.replies = targetTweetObj.replies.filter(function(tweet){
        if(tweet.idreply){
            return tweet.idreply !== b
        } else{
            return tweet
        }
    })
    render(tweetsData)

}

function handleclickReply(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0] 
    targetTweetObj.replies.push({
        
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${document.getElementById(tweetId).value}`,
            idreply:uuidv4()  
    })
    targetTweetObj.retweets++
    render(tweetsData)
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render(tweetsData)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render(tweetsData) 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            post: 'mypost'
        })
        render(tweetsData)
    tweetInput.value = ''
    }

}

function getFeedHtml(a){
    let feedHtml = ``
    
    a.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                let replyid = ''
                if(reply.idreply){
                    replyid = reply.idreply
                }
                let replyhidden = reply.handle == "@Scrimba"?`<i class="fa-solid fa-trash" data-btndeletereply = ${tweet.uuid} id=${replyid}></i>`: ""
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
            ${replyhidden}
        </div>
</div>
`
            })
        }
        repliesHtml +=`
        <div class="tweet-inner">
        <img class="profile-pic" src="images/scrimbalogo.png">
        <input class='input-text' placeholder="Reply"  type="text" id=${tweet.uuid}>
        <button class="btn-reply" data-btnreply=${tweet.uuid}>Reply</button>
        </div>`
        
        let btndeletepost = ''
        if(tweet.post){
            btndeletepost = `<i class="fa-solid fa-trash" data-btndeletepost=${tweet.uuid}></i>`
        }
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>  
        ${btndeletepost}        
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`

   })
   return feedHtml 
}

function render(b){
    document.getElementById('feed').innerHTML = getFeedHtml(b)
}

render(tweetsData)

