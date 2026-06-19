// 1. Слайд-шоу фонового экрана
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide()
{
	if (slides.length > 0) {
		slides[currentSlide].classList.remove('active');
		currentSlide = (currentSlide + 1) % slides.length;
		slides[currentSlide].classList.add('active');
	}
}
setInterval(nextSlide, 5000);

// 2. Таймер обратного отсчета (31 июля 2026)
const weddingDate = new Date(2026, 6, 31, 0, 0).getTime(); // Июль — это 6

const timerInterval = setInterval(function() {
	const now = new Date().getTime();
	const distance = weddingDate - now;

	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	const dEl = document.getElementById("days");
	const hEl = document.getElementById("hours");
	const mEl = document.getElementById("minutes");
	const sEl = document.getElementById("seconds");

	if (dEl && hEl && mEl && sEl) {
		dEl.innerText = days < 10 ? "0" + days : days;
		hEl.innerText = hours < 10 ? "0" + hours : hours;
		mEl.innerText = minutes < 10 ? "0" + minutes : minutes;
		sEl.innerText = seconds < 10 ? "0" + seconds : seconds;
	}

	if (distance < 0) {
		clearInterval(timerInterval);
		const cd = document.getElementById("countdown");
		if (cd)
			cd.innerHTML = "<h3>Этот счастливый день настал!</h3>";
	}
}, 1000);

// 3. Переключатель программы дня (Вкладки)
function switchDay(dayNumber)
{
	const buttons = document.querySelectorAll('.day-btn');
	buttons.forEach(btn => btn.classList.remove('active'));

	const day1 = document.getElementById('day-1-content');
	const day2 = document.getElementById('day-2-content');

	if (buttons[dayNumber - 1]) {
		buttons[dayNumber - 1].classList.add('active');
	}

	if (day1 && day2) {
		if (dayNumber === 1) {
			day1.classList.add('active');
			day2.classList.remove('active');
		} else {
			day2.classList.add('active');
			day1.classList.remove('active');
		}
	}

	// Пересчитываем плавное появление элементов
	reveal();
}

// 4. Логика формы (Скрытие блока напитков, если гость не придет)
const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
const drinksBlock = document.getElementById('drinks-block');

attendanceRadios.forEach(radio => {
	radio.addEventListener('change', function() {
		if (drinksBlock) {
			drinksBlock.style.display = this.value === 'no' ? 'none' : 'block';
		}
	});
});

// 5. Отправка формы RSVP
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
	rsvpForm.addEventListener('submit', function(e) {
		e.preventDefault(); // Запрещаем стандартную перезагрузку страницы

		const data = new FormData(this);
		const action = this.getAttribute('action');
		const msg = document.getElementById('form-message');

		fetch(action, {
			method: 'POST',
			body: data
		})
		.then(response => {
			// FormDesigner при успешной отправке возвращает статус 200
			if (response.ok) {
				rsvpForm.style.display = 'none'; // Прячем форму
				if (msg)
					msg.style.display = 'block'; // Показываем красивый текст успеха
			} else {
				alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
			}
		})
		.catch(error => {
			alert('Ошибка сети. Проверьте подключение к интернету.');
			console.error('Error:', error);
		});
	});
}

// 6. Плавное появление элементов при прокрутке страницы
function reveal()
{
	const reveals = document.querySelectorAll(".reveal");
	reveals.forEach((element) => {
		const windowHeight = window.innerHeight;
		const elementTop = element.getBoundingClientRect().top;
		const elementVisible = 100;

		if (elementTop < windowHeight - elementVisible) {
			element.classList.add("active");
		}
	});
}
window.addEventListener("scroll", reveal);
reveal(); // Вызов при загрузке

// Логика фоновой музыки
function toggleMusic()
{
	const music = document.getElementById('bg-music');
	const btn = document.getElementById('music-toggle');
	const icon = document.getElementById('music-icon');

	if (music && btn && icon) {
		if (music.paused) {
			music.play().then(() => {
				btn.classList.add('playing');
				icon.innerText = '🔊'; // Меняем иконку на играющий динамик
			}).catch(error => {
				console.log("Автозапуск заблокирован браузером, нужен прямой клик:", error);
			});
		} else {
			music.pause();
			btn.classList.remove('playing');
			icon.innerText = '🎵'; // Возвращаем нотку
		}
	}
}

// Дополнительно: пробуем включить музыку автоматически при первом же скролле пользователя
window.addEventListener('scroll', function autoPlayOnScroll()
{
	const music = document.getElementById('bg-music');
	const btn = document.getElementById('music-toggle');
	const icon = document.getElementById('music-icon');

	if (music && music.paused) {
		music.play().then(() => {
			if (btn && icon) {
				btn.classList.add('playing');
				icon.innerText = '🔊';
			}
			// Удаляем слушатель, чтобы музыка не перезапускалась при каждом скролле
			window.removeEventListener('scroll', autoPlayOnScroll);
		}).catch(() => {
			// Если браузер всё равно заблокировал, ничего не делаем, гость нажмет кнопку сам
		});
	}
}, { once: true }); // Сработает только один раз