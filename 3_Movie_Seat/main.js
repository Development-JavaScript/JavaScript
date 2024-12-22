const container = document.querySelector('.container');
// 지정한 CSS 선택자와 일치하는 모든 요소
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.querySelector('#count');
const total = document.querySelector('#total');
const empty = document.querySelector('#empty');
const allSeats = document.querySelector('#allSeats');
const movieSelect = document.querySelector('#movie');
const clearBtn = document.querySelector('.clear');
// 티켓가격은 : 영화 value 값
let ticketPrice = +movieSelect.value;


/* 영화 index, 가격 데이터 저장 */
const setMovieData = (movieIdx, moviePrice) => {
    // setItem() 메서드 : key값인 저장될 값의 이름,  value값인 실제로 저장 될 값 저장 
    localStorage.setItem('selectedMovieIndex', movieIdx);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

/*  선택한 영화에 따라 index, 가격, 포스터 변경 */
movieSelect.addEventListener('change', e => {
    //e.target : 실제 이벤트가 발생한 value
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);

    // 인덱스 순서에 맞게 포스터변경
    const visualSection = document.querySelector('.banner');

    visualSection.classList.remove(visualSection.classList[1]);
    //백틱(`)을 사용하여 문자열 안에 변수 
    visualSection.classList.add(`banner_img${e.target.selectedIndex}`);

    updateSelectedCount()
})

/* 선택 좌석 데이터 저장 */
const populateUI = () => {
    /* JSON.parse 사용 - JSON 문자열 > 객채/배열형식 변환 */
    /* LocalStorage : 브라우저에 key-value 값을 Storage 저장 (세션이 바꿔도 저장데이터 유지) */
    // localStorage.getItem() - 저장된 값을 가져오기
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    /* length 속성 : 문자열의 길이를 체크 */
    //  0 보다 크고(빈값x) + null x 일 경우 
    if(selectedSeats !== null && selectedSeats.length > 0) {
        //forEach 반복문 :  
        seats.forEach((seat, idx) => {
            if(selectedSeats.indexOf(idx) > -1) {
                //클래스 추가
                seat.classList.add('selected');
            }
        })
    } else {
        seats.forEach(seat => {
            //클래스 제거
            seat.classList.remove('selected');
        })
    }
    const selectedMovieIdx = localStorage.getItem('selectedMovieIdx');

    // null 아니라면 선택된 영화 인덱스 = 선택한영화선택된 인덱스
    if (selectedMovieIdx != null) {
        movieSelect.selctedIdx = selectedMovieIdx;
    }
}
populateUI();

/* 선택한 좌석 수 , 총 가격 화면 표출 */
const updateSelectedCount = () => {

    // querySelectorAll : 일치하는 모든 요소를 변환
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    // map() 함수 : 신규 배열생성(선택한 좌석만) : [1, 2 ,3..]
    // ... spread operator = 펼침연산자 = (...)
    const seatsIndex = [...selectedSeats].map(seat => {
        // 전체 좌석 중 선택한 좌석 index값
        return [...seats].indexOf(seat);
    });
    // length = 문자열 길이를 이용하여 선택한 좌석 값 : [1, 2, 3,] = 3
    const selectedSeatsCnt = selectedSeats.length;

    // 선택한 좌석 값을 JSON  stringify 통한 localStorage 저장
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex))

    // innerText : count 안의 text값만 가져온다
    count.innerText = selectedSeatsCnt;
    total.innerText = comma(selectedSeatsCnt * ticketPrice);
    // 빈 좌석계산
    empty.innerText = ("48" - selectedSeatsCnt);

    // 천단위 comma 추가
    function comma(total) {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// 좌석 클릭 이벤트
container.addEventListener('click' ,(e) => {
    // contains apthem : 선택요소가 특정 부모 요소에 속해잇는지 
    // 선택한 영화 value 0 보다크고  class 'seat' + 'occupoed x'  클릭가능 + selected 토글기능
    if (movieSelect.value > 0 && e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) 
    {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
})

// 초기화버튼 클릭이벤트
clearBtn.addEventListener('click',() => {
    localStorage.clear();
    console.log('clear btn clicked');
    populateUI()
    updateSelectedCount();
})

updateSelectedCount();