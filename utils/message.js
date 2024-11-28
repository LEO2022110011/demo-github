import {useEffect } from "react";
import { createRoot } from 'react-dom/client';
import errorIcon from '../assets/icons/error.svg'
import successIcon from '../assets/icons/success.svg'
import warningIcon from '../assets/icons/warning.svg'

// const appearAnimation = [{ opacity: 0 }, { opacity: 1 }]; // 淡入动画效果
const disappearAnimation = [{ opacity: 0 }, { opacity: 0 }]; // 淡出动画效果
const animationTime = 300;

const Message = ({ type, content, duration, hide }) => {

  useEffect(() => {
    if(type ==="loading") return
    setTimeout(() => {
      hide()
    }, duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icon = type === "error" ? errorIcon : type === "success" ? successIcon : warningIcon

  return <div id="toast-success" className="z-50 fixed top-[20px] left-[50%] translate-x-[-50%] flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow " role="alert">
      {
        type === "loading" ? <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg> : 
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg ">
            <img src={icon} alt="" className="w-5 h-5"/>
            <span className="sr-only">Check icon</span>
        </div>
      }
      
      
      <div className="ms-3 text-sm font-normal">{typeof content === "object" ? content.message : content}</div>
      <button onClick={hide} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-success" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
  </div>

  
}

export default function message(type, content, duration = 5000) {
  const nextToastDiv = document.createElement('div');
  nextToastDiv.id = 'toast-box';
  const presentToastDiv = document.getElementById('toast-box');
  if (presentToastDiv && document.body.contains(presentToastDiv)) {
    document.body.replaceChild(nextToastDiv, presentToastDiv);
  } else {
    document.body.appendChild(nextToastDiv);
    // nextToastDiv.animate(appearAnimation, animationTime);
  }
  const root = createRoot(nextToastDiv);



  const hide = () => nextToastDiv.animate(disappearAnimation, animationTime).onfinish = function () {
    root.unmount();
    // 容错处理
    if (document.body.contains(nextToastDiv)) document.body.removeChild(nextToastDiv);
  };
  root.render(<Message type={type} content={content} duration={duration} hide={hide} />);
  return hide
}





