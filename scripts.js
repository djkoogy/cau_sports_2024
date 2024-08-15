let currentPage = 1;
const totalQuestions = 9;  // 총 문항 수
const categories = { SA: 0, LP: 0, SR: 0, EI: 0, DM: 0 };
let currentRank = 1;
let selectedOptions = [];


function selectOption(optionElement) {
    const optionId = optionElement.id;
    
    if (selectedOptions.includes(optionId)) {
        const index = selectedOptions.indexOf(optionId);
        selectedOptions.splice(index, 1);
        optionElement.classList.remove('selected');
        optionElement.querySelector('.rank').textContent = '';
        currentRank--;
        reorderRanks();
    } else if (currentRank <= 5) {
        selectedOptions.push(optionId);
        optionElement.classList.add('selected');
        optionElement.querySelector('.rank').textContent = currentRank;
        currentRank++;
    }
}

function reorderRanks() {
    selectedOptions.forEach((optionId, index) => {
        const optionElement = document.getElementById(optionId);
        optionElement.querySelector('.rank').textContent = index + 1;
    });
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = (currentPage / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function nextPage() {
    if (selectedOptions.length < 5) {
        alert("지문을 모두 선택해주세요.");
        return;
    }

    const currentQuestion = document.getElementById(`question${currentPage}`);
    
    selectedOptions.forEach(optionId => {
        const optionElement = document.getElementById(optionId);
        const rank = parseInt(optionElement.querySelector('.rank').textContent);
        const category = optionElement.getAttribute('data-category');
        categories[category] += (6 - rank); // 순위에 따른 점수 부여
    });

    // 다음 페이지로 넘어가기 전에 상태 초기화
    selectedOptions = [];
    currentRank = 1;
    currentQuestion.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
        option.querySelector('.rank').textContent = '';
    });

    // 마지막 문항에서 결과 화면으로 이동하기 전에 점수 계산 로직이 누락되지 않도록 수정
    if (currentPage < totalQuestions) {
        currentQuestion.style.display = 'none';
        currentPage++;
        document.getElementById(`question${currentPage}`).style.display = 'block';
        updateProgressBar();
    } else {
        showResults();  // 마지막 문항이 끝나면 결과를 표시
    }
}

function showResults() {
    const resultContainer = document.getElementById('result');
    let resultText = '';

    Object.keys(categories).forEach(category => {
        resultText += `${category.toUpperCase()} 카테고리 점수: ${categories[category]}<br>`;
    });

    resultContainer.innerHTML = resultText;
    document.getElementById('survey-container').innerHTML = `
        <h2>결과</h2>
        <p>${resultText}</p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('question1').style.display = 'block';
    updateProgressBar();  // 첫 번째 문항에서 프로그래스 바 초기화
});
