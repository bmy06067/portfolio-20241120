window.onload = function () {
    setTimeout(() => {
        window.scrollTo(0, 0); // 페이지 로드 후 맨 위로 이동
    }, 100);
};

const navbar = document.querySelector('.navigation');
const mainSection = document.querySelector('main');
let lastScrollTop = 0;
const delta = 5; // 스크롤 감도 설정

// 내비게이션 숨김/표시 기능
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const mainRect = mainSection.getBoundingClientRect();

    // 일정 범위 이상 스크롤 이동 시 내비게이션 숨김/표시
    if (Math.abs(lastScrollTop - scrollTop) > delta) {
        if (scrollTop > lastScrollTop) {
            navbar.classList.add('hidden');
        } else if (scrollTop + window.innerHeight < document.body.offsetHeight) {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    }

    // main 섹션의 위치에 따라 opaque 클래스 추가/제거
    if (mainRect.top <= 0 && mainRect.bottom > 0) {
        navbar.classList.remove('opaque');
    } else {
        navbar.classList.add('opaque');
    }
});

// Intersection Observer로 섹션이 화면에 들어올 때 애니메이션 적용
function applyIntersectionObserver(section) {
    const contents = section.querySelectorAll('.content');
    let timeoutIds = [];

    const observerOptionsIn = {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -50% 0px"
    };

    const observerIn = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                contents.forEach((content, index) => {
                    const timeoutId = setTimeout(() => {
                        content.classList.add('fade-in');
                    }, index * 500);
                    timeoutIds.push(timeoutId);
                });
            }
        });
    }, observerOptionsIn);

    const observerOptionsOut = {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -50% 0px"
    };

    const observerOut = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
                contents.forEach((content) => {
                    content.classList.remove('fade-in');
                });
            }
        });
    }, observerOptionsOut);

    observerIn.observe(section);
    observerOut.observe(section);
}

// .section_1과 .section_2에 Intersection Observer 적용
document.addEventListener('DOMContentLoaded', () => {
    const section1 = document.querySelector('.section_1');
    const section2 = document.querySelector('.section_2');

    applyIntersectionObserver(section1);
    applyIntersectionObserver(section2);

    // .section_3의 h1 텍스트에 한글자씩 애니메이션 적용
    const section3 = document.querySelector('.section_3');
    const h1Text = section3.querySelector('h1');
    const text = h1Text.innerText;
    h1Text.innerHTML = '';

    // 텍스트를 한 글자씩 span으로 감싸서 추가
    [...text].forEach((letter, index) => {
        const letterNode = document.createElement('span');
        letterNode.innerText = letter;
        letterNode.style.opacity = '0';
        letterNode.style.display = 'inline-block';
        letterNode.style.transition = `opacity 0.5s ease ${index * 0.1}s`;
        letterNode.style.fontSize = '50px';

        if (letter === ' ') {
            letterNode.style.display = 'inline';
        }

        h1Text.appendChild(letterNode);
    });

    const observer3 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const letters = h1Text.querySelectorAll('span');
            if (entry.isIntersecting) {
                letters.forEach((letter) => {
                    letter.style.opacity = '1';
                });
            } else {
                letters.forEach((letter) => {
                    letter.style.opacity = '0';
                });
            }
        });
    }, { threshold: 0.3 });

    observer3.observe(section3);
});

// 슬라이드 기능
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.best_slid .slider');
    const slideItems = Array.from(document.querySelectorAll('.best_slid .slide-item'));
    const totalSlides = slideItems.length;
    const itemsPerGroup = 4;
    const totalGroups = Math.ceil(totalSlides / itemsPerGroup);

    let currentGroupIndex = 0;
    let autoSlideInterval;

    const createSlideGroups = () => {
        slider.innerHTML = '';

        for (let i = 0; i < totalGroups; i++) {
            const group = document.createElement('div');
            group.classList.add('slide-group');
            slider.appendChild(group);

            const start = i * itemsPerGroup;
            const end = Math.min(start + itemsPerGroup, totalSlides);

            for (let j = start; j < end; j++) {
                group.appendChild(slideItems[j]);
            }
        }

        slider.style.width = `${totalGroups * 80}vw`;
    };

    const updateSlider = (direction, initialize = false) => {
        if (initialize) slider.style.transition = 'none';
        const offset = -(currentGroupIndex * 80);
        slider.style.transform = `translateX(${offset}vw)`;
        if (initialize) setTimeout(() => slider.style.transition = 'transform 0.5s ease', 0);
    };

    const nextSlide = () => {
        if (currentGroupIndex < totalGroups - 1) {
            currentGroupIndex++;
        } else {
            currentGroupIndex = 0;
        }
        updateSlider('next');
    };

    const prevSlide = () => {
        if (currentGroupIndex > 0) {
            currentGroupIndex--;
        } else {
            currentGroupIndex = totalGroups - 1;
        }
        updateSlider('prev');
    };

    // 자동 슬라이드 기능 추가
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000); // 3초마다 다음 슬라이드로 이동
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // 버튼 클릭 시 자동 슬라이드 일시 중지
    document.querySelector('.best_slid .next').addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    document.querySelector('.best_slid .prev').addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    createSlideGroups();
    updateSlider('next', true);
    startAutoSlide(); // 자동 슬라이드 시작
});
document.addEventListener('DOMContentLoaded', () => {
    const sliders = [
        { slides: document.querySelectorAll('.media-slid'), buttons: document.querySelectorAll('.media-slider-button') },
        { slides: document.querySelectorAll('.INFO-slid'), buttons: document.querySelectorAll('.INFO-slider-button') },
        { slides: document.querySelectorAll('.RESTAURANT_slid'), buttons: document.querySelectorAll('.RESTAURANT-slider-button') },
    ];

    sliders.forEach(({ slides, buttons }) => {
        let currentSlide = 0;

        // 슬라이드를 표시하는 함수
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? '1' : '0'; // 현재 슬라이드만 보이도록 설정
                slide.style.position = i === index ? 'static' : 'absolute'; // 현재 슬라이드만 원래 위치에 표시
            });
            buttons.forEach((button, i) => {
                button.classList.toggle('active', i === index); // 현재 슬라이드 버튼 활성화
            });
        }

        // 버튼 클릭 시 해당 슬라이드로 이동
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // 자동 슬라이드 전환 (3초마다)
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);

        // 첫 번째 슬라이드 표시
        showSlide(currentSlide);
    });
});
