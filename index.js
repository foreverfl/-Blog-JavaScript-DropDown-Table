fetch('./src/data.json')
    .then(response => response.json())
    .then(data => {
        let itemsPerPage = 5; // 페이지당 보여줄 항목 수
        let totalPages = Math.ceil(data.length / itemsPerPage); // 전체 페이지 수
        let currentPage = 1; // 현재 페이지

        const paginationContainer = document.getElementById('pagination'); // 페이지네이션 버튼을 추가할 영역
        const dropdownSelect = document.querySelector('.dropdown-select'); // 드롭다운 메뉴 영역

        // 드롭다운 메뉴 값이 변경될 때마다 itemsPerPage 업데이트
        dropdownSelect.addEventListener('change', function () {
            const selectedValue = parseInt(dropdownSelect.value);
            if (!isNaN(selectedValue)) {
                itemsPerPage = selectedValue;
                totalPages = Math.ceil(data.length / itemsPerPage);
                renderTable(data, currentPage, itemsPerPage);
                renderPaginationButtons(paginationContainer, totalPages, currentPage);
            }
        });

        // 초기 테이블 렌더링 및 페이지네이션 버튼 업데이트
        renderTable(data, currentPage, itemsPerPage);
        renderPaginationButtons(paginationContainer, totalPages, currentPage);

        // 테이블 렌더링 함수
        function renderTable(data, currentPage, itemsPerPage) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentPageData = data.slice(startIndex, endIndex);

            // 테이블 요소 가져오기
            const table = document.getElementById('table');

            // 기존 테이블 내용 비우기
            table.innerHTML = '';

            // 테이블 헤더 생성
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Name', 'Title', 'Email', 'Role'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);

            // 헤더 스타일 적용
            thead.classList.add('gray-row');

            table.appendChild(thead);

            // 테이블 바디 생성
            const tbody = document.createElement('tbody');
            currentPageData.forEach((item, index) => {
                const row = document.createElement('tr');
                const columns = [item.name, item.title, item.email, item.role];

                columns.forEach(columnText => {
                    const td = document.createElement('td');
                    td.textContent = columnText;
                    row.appendChild(td);
                });

                // 행 스타일 적용
                if (index % 2 === 0) {
                    row.classList.add('white-row');
                } else {
                    row.classList.add('gray-row');
                }

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
        }

        function renderPaginationButtons(container, totalPages, currentPage) {
            container.innerHTML = ''; // 기존 버튼 제거

            // 이전 페이지로 이동하는 버튼 생성
            const prevButton = document.createElement('button');
            prevButton.classList.add('arrow');
            prevButton.textContent = '<<';
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable(data, currentPage, itemsPerPage);
                    updatePaginationButtons(container, totalPages, currentPage);
                }
            });
            container.appendChild(prevButton);

            // 페이지 번호 버튼 생성
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', (event) => {
                    currentPage = parseInt(event.target.textContent);
                    renderTable(data, currentPage, itemsPerPage);
                    updatePaginationButtons(container, totalPages, currentPage);
                });
                container.appendChild(button);
            }

            // 다음 페이지로 이동하는 버튼 생성
            const nextButton = document.createElement('button');
            nextButton.classList.add('arrow');
            nextButton.textContent = '>>';
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable(data, currentPage, itemsPerPage);
                    updatePaginationButtons(container, totalPages, currentPage);
                }
            });

            container.appendChild(nextButton);
        }

        function updatePaginationButtons(container, totalPages, currentPage) {
            const buttons = container.querySelectorAll('button');

            buttons.forEach(button => {
                button.classList.remove('active');
            });

            const currentPageButton = container.querySelector(`button:nth-child(${currentPage + 1})`);
            if (currentPageButton) {
                currentPageButton.classList.add('active');
            }
        }
    }).catch(error => {
        console.log('Error:', error);
    });