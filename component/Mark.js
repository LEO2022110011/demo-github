import { useState, useRef } from "react";
import useOutsideClick from "../utils/useClickOutside";
import service from "../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

export default function Mark({value, id, handleItemClick}) {
    const [isVisible, setIsVisible] = useState(false);
    const [markValue, setMarkValue] = useState(value.toString());
    const markRef = useRef(null);
    const popoverRef = useRef(null);
    const colorMap = {
        0: '',
        1: '#ABEBC6',
        2: '#F9E79F',
        3: '#F8C471',
        4: '#EC7063',
        5: '#CB4335',
        6: '#7D3C98',
        7: '#dc2626'
    }

    useOutsideClick(popoverRef, () => {
        if (isVisible) {
            setIsVisible(false);
        }
    });

    function showPopover(event) {
        event.stopPropagation();
        // setIsVisible(true)
        handleItemClick(id)
    }
    
    async function handleMarkClick(event, selectedValue) {
        event.stopPropagation();
        setMarkValue(selectedValue)
        setIsVisible(false)
        await service.post("/filer/rename", {item_id: id, new_mark: parseInt(selectedValue) });
    }
        

    return <div className="absolute w-4 h-4 right-2 top-2">
        {parseInt(markValue) >= 7 ? <FontAwesomeIcon color={colorMap[markValue]} onClick={showPopover}  className="w-4 h-4 transition transform hover:scale-110 " icon={faHeart}/> : 
                <div onClick={showPopover} ref={markRef} className={`w-full h-full rounded-full transition transform hover:scale-110 `} 
            style={{ backgroundColor: colorMap[markValue], border: markValue === '0' ? '2px solid #8e8d92' : 'none' }}></div>
        }
        {isVisible && (
          <div
            ref={popoverRef}
            className="absolute py-2 right-5 top-[-10px] flex z-10 mt-2 bg-white rounded-md shadow w-56 justify-around"
          >
            {
                Object.keys(colorMap).map(item => {
                    return parseInt(item) >=7 ? 
                    <div onClick={(e) => handleMarkClick(e, item)} className={`flex justify-center items-center transition transform hover:scale-110 w-4 h-4 rounded-full duration-200`}>
                        <FontAwesomeIcon color={colorMap[item]}  className="w-4 h-4" icon={ item === markValue ?  faHeart : farHeart}/></div>
                        : 
                    <div onClick={(e) => handleMarkClick(e, item)} key={item} className={`flex justify-center items-center transition transform hover:scale-110 w-4 h-4 rounded-full duration-200`} 
                    style={{ backgroundColor: colorMap[item],border: item === '0' ? '2px solid #8e8d92' : 'none' }}>
                        { item === markValue && <FontAwesomeIcon color={markValue === '0' ? '#8e8d92': '#fff' } className="w-3 h-3" icon={faCheck} />}
                    </div>
                })
            }
          </div>
        )}
    </div>
};


  