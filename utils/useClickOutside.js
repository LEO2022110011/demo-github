import { useEffect } from 'react';

function useOutsideClick(ref, onOutsideClick) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }

    // 绑定监听事件
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // 解绑监听事件，以避免内存泄漏
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onOutsideClick]); // 依赖项数组包括ref和onOutsideClick
}

export default useOutsideClick;
