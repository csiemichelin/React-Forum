import { useState } from 'react'
import './App.scss'
import avatar from './images/bozai.png'
import _ from 'lodash'  // _為使用各種方法的前綴
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'
import classNames from 'classnames'

// 預設評論列表數據
const list = [
  {
    // 評論id
    rpid: 1,
    // 用戶信息
    user: {
      uid: '13258165',
      avator: 'http://toutiao.itheima.net/resources/images/98.jpg',
      uname: '周杰倫'
    },
    // 評論內容
    content: '唉呦，不錯喔',
    // 評論時間
    ctime: '10-18 08:15',
    like: 88,
  },
  {
    rpid: 2,
    user: {
      uid: '30009257',
      avator: avatar,
      uname: '神奇小魚'
    },
    content: '全端大師是我',
    ctime: '10-17 08:15',
    like: 666,
  },
  {
    rpid: 3,
    user: {
      uid: '13258167',
      avator: 'http://toutiao.itheima.net/resources/images/95.jpg',
      uname: '呆呆'
    },
    content: '偶不想上班~',
    ctime: '10-18 01:15',
    like: 1,
  },
  {
    rpid: 4,
    user: {
      uid: '13258168',
      avator: 'http://toutiao.itheima.net/resources/images/91.jpg',
      uname: '小冰塊'
    },
    content: '健身誰比我牛!',
    ctime: '06-06 06:59',
    like: 8,
  },
  {
    rpid: 5,
    user: {
      uid: '13258169',
      avator: 'http://toutiao.itheima.net/resources/images/66.jpg',
      uname: '布布'
    },
    content: '最愛小魚囉<3',
    ctime: '12-23 00:00',
    like: 65,
  }
]

// 當前登錄用戶信息
const user = {
  // 用戶id
  uid: '30009257',
  // 用戶頭像
  avatar,
  // 用戶暱稱
  uname: '神奇小魚',
}

// 導航 Tab 列表
const tabs = [
  { type: 'hot', text: '最熱' },
  { type: 'time', text: '最新' },
]

const App = () => {
  // 渲染評論列表
  // 1. 使用useState維護list，初始也可以先做排序
  const [commentList, setCommentList] = useState(_.orderBy(list, 'like', 'desc'))

  // 2. 刪除功能 - 拿到當前ID以ID為條件對評論列表做filter過濾
  const handleDel = (id) => {
    console.log(id)
    // 對commentList做filter過濾
    setCommentList(commentList.filter(item => item.rpid !== id))  // filter函數會回傳一個新的list，所以可以帶入setCommentList進行覆蓋
  }
  
  // 3. tab切換功能
  // 3-1. 點擊誰就把誰的type記錄起來
  // 3-2. 通過紀錄的type和每一項遍歷顯示時的type做匹配，控制激活類名(active)的顯示
  const [type, setType] = useState('hot')
  const handleTabChange = (type) => {
    console.log(type)
    setType(type)
    // 基於列表的排序，要用useState才能獲去到UI當下的狀態去更新list
    // lodash 封裝好的工具包，裡頭有很多實用工具
    if (type === 'hot') {
      // 根據點讚數排序
      setCommentList(_.orderBy(commentList, 'like', 'desc'))
    } else {
      // 根據創建時間排序
      setCommentList(_.orderBy(commentList, 'ctime', 'desc'))
    }
  }

  // 4. 發表評論功能
  const [content, setContent] = useState('')
  // 4.1 觸發按鈕就把輸入的評論更新到list中
  const handlPublish = () => {
    setCommentList([
      ...commentList,
      {
        rpid: uuidV4(), // 隨機id,
        user: {
          uid: '30009257',
          avator: avatar,
          uname: '神奇小魚'
        },
        content: content,
        ctime: dayjs(new Date()).format('MM-DD hh:mm'), // 格式化 月-日 時:分
        like: 0
      }
    ]) 
    setContent('') // 清空輸入框
  }

  // 5. 點讚功能
  // 點讚功能列表
  const [likedComments, setLikedComments] = useState({})
  // 5.1 觸發按鈕就點讚，並更新list中的點讚數
  const toggleLike = (id) => {
    const isLiked = likedComments[id]
    // const newLikedComments = Object.assign({}, likedComments);
    // newLikedComments[id] = !isLiked;
    // ES6新語法，若對象的屬性(:左方)為變動值，則用[]符號將其包住，取代上述兩行
    const newLikedComments = { ...likedComments, [id]: !isLiked }
    // 紀錄有哪些評論在此頁面上讚的變動值
    setLikedComments(newLikedComments)

    // 更新 commentList
    setCommentList(commentList.map(comment => 
      comment.rpid === id
        ? { ...comment, like: isLiked ? comment.like - 1 : comment.like + 1 }
        : comment
    ))
  };

  return (
    <div className="app">
      {/* 導航 Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">評論</span>
            {/* 評論數量 */}
            <span className="total-reply">{commentList.length}</span>
          </li>
          <li className="nav-sort">
            {/* portal上的tabs誰被激活，就擁有高亮類名： active */}
            {tabs.map(item => 
              <span key={item.type} 
                onClick={() => handleTabChange(item.type)} 
                // className={`nav-item 'active'`}>
                // 此為邏輯運算符，成立則為active，className改成以下使因為想要用狀態驅動UI，讓其能變active且list可以進行排序
                // className={`nav-item ${item.type === type && 'active'}`}>
                className={classNames('nav-item', {'active': item.type === type})}>
                {item.text}
              </span>)}
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* 發表評論 */}
        <div className="box-normal">
          {/* 當前用戶頭像 */}
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={user.avatar} alt="用戶頭像" />
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* 評論框 */}
            <textarea
              className="reply-box-textarea"
              placeholder="發一條友善的評論"
              // ref={inputRef}
              value={content}
              // 可以用e.target.value去獲取輸入的值
              onChange={(e) => setContent(e.target.value)}
            />
            {/* 發佈按鈕 */}
            <div className="reply-box-send">
              {/* <div className="send-text">發佈</div> */}
              {/* 觸發按鈕就把輸入的評論更新到list中 */}
              <div className="send-text" onClick={handlPublish}>發佈</div>
            </div>
          </div>
        </div>

        {/* 評論列表 */}
        <div className="reply-list">
          {/* 評論項 */}
          {commentList.map(item => (
            <div key={item.rpid} className="reply-item">
              {/* 頭像 */}
              <div className="root-reply-avatar">
                <div className="bili-avatar">
                  <img
                    className="bili-avatar-img"
                    alt=""
                    src={item.user.avator}
                  />
                </div>
              </div>

              <div className="content-wrap">
                {/* 用戶名 */}
                <div className="user-info">
                  <div className="user-name">{item.user.uname}</div>
                </div>
                {/* 評論內容 */}
                <div className="root-reply">
                  <span className="reply-content">{item.content}</span>
                  <div className="reply-info">
                    {/* 評論時間 */}
                    <span className="reply-time">{item.ctime}</span>
                    <span
                      // className={`heart-button ${likedComments[item.rpid] ? 'liked' : ''}`}
                      className={classNames('heart-button', {'liked': likedComments[item.rpid] ? 'liked' : ''})}
                      onClick={() => toggleLike(item.rpid)}
                    >
                      ♥
                    </span>
                    {/* 點贊數 */}
                    <span className="reply-time">點贊數:{item.like}</span>
                    {/* 只有自己的評論才顯示刪除按鈕，條件：user.id === item.user.id */}
                    {user.uid === item.user.uid &&
                      <span className="delete-btn" onClick={() => handleDel(item.rpid)}>
                        刪除
                      </span>}
                  </div>
                </div>
              </div>
            </div>  
          ))}
        </div>
      </div>
    </div>
  )
}

export default App