document.addEventListener("DOMContentLoaded", async () => {
	const itemsPerPage = 8;
	let currentPage = 1;

	const dynamicContent = document.querySelector(".dynamic_content");
	const sidebarItems = document.querySelectorAll(".sidebar__item, menu__item");

	const fetchData = async () => {
		try {
			const response = await fetch("data.json");
			const data = await response.json();
			showCustomers(data);
		} catch (error) {
			console.error("Помилка при завантаженні даних:", error);
		}
	};

	const showCustomers = (data) => {
		renderTable(data, currentPage, itemsPerPage);
		setupPagination(data, itemsPerPage);
	};

	const renderTable = (data, currentPage, itemsPerPage) => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const paginatedItems = data.slice(start, end);

		let tableHtml = `<tr class="table__header">
											<th class="table__header-item">Customer Name</th>
											<th class="table__header-item">Company</th>
											<th class="table__header-item">Phone Number</th>
											<th class="table__header-item">Email</th>
											<th class="table__header-item">Country</th>
											<th class="table__header-item">Status</th>
										</tr>`;

		paginatedItems.forEach((customer) => {
			const row = `<tr class="table__row">
										<td class="table__cell table__cell-item">
										${customer.name}</td>
										<td class="table__cell table__cell-item">${customer.company}</td>
										<td class="table__cell table__cell-item">${customer.phone}</td>
										<td class="table__cell table__cell-item">${customer.email}</td>
										<td class="table__cell table__cell-item">${customer.country}</td>
										<td class="table__cell table__status"><span class="${
											customer.status ? "active" : "inactive"
										}">${customer.status ? "Active" : "Inactive"}</span></td>
										</tr>`;
			tableHtml += row;
		});

		dynamicContent.innerHTML = `
					<div class="customers">
							<div class="customers__header">
									<h3 class="customers__title">All Customers</h3>
									<label class="customers__search-label">
											<svg class="customers__search-icon">
													<use href="img/sprite.svg#search-1"></use>
											</svg>
											<input type="search" class="customers__search-input" placeholder="Search..."/>
									</label>
							</div>
							<div class="customers__list">
									<table class="customers-table">${tableHtml}</table>
							</div>
							<footer class="footer">
								<div class="footer__info">Showing data ${start + 1} to ${end} of ${
			data.length
		} entries</div>
									<div class="pagination" id="pagination">
											<button class="pagination__button" id="prevPage">&lt;</button>
											<div id="pagination__numbers"></div>
											<button class="pagination__button" id="nextPage">&gt;</button>
									</div>
							</footer>
					</div>`;
	};

	const setupPagination = (data, itemsPerPage) => {
		const paginationNumbers = document.getElementById("pagination__numbers");
		const pageCount = Math.ceil(data.length / itemsPerPage);
		paginationNumbers.innerHTML = "";

		for (let i = 1; i <= pageCount; i++) {
			const button = document.createElement("button");
			button.innerText = i;
			button.classList.add("pagination__button");
			if (i === currentPage) button.classList.add("active");
			button.addEventListener("click", () => {
				currentPage = i;
				showCustomers(data);
			});
			paginationNumbers.appendChild(button);
		}

		const prevPage = document.getElementById("prevPage");
		const nextPage = document.getElementById("nextPage");

		prevPage.addEventListener("click", () => {
			if (currentPage > 1) {
				currentPage--;

				showCustomers(data);
			}
		});

		nextPage.addEventListener("click", () => {
			if (currentPage < pageCount) {
				currentPage++;

				showCustomers(data);
			}
		});
	};

	sidebarItems.forEach((item) => {
		item.addEventListener("click", () => {
			document
				.querySelector(".sidebar__item--active")
				.classList.remove("sidebar__item--active");
			item.classList.add("sidebar__item--active");

			const contentTitle = item.querySelector(".sidebar__text").textContent;

			if (contentTitle === "Customers") {
				fetchData();
			} else {
				dynamicContent.innerHTML = `<h2 class="dynamic_content__title">${contentTitle}</h2>`;
			}
		});
	});

	fetchData();

	const buttonBurger = document.querySelector(".header__menu-burger");
	const burgerMenu = document.querySelector(".menu__burger");
	const spanBtnBurger = document.querySelector(".header__menu-btn");
	const menuItems = document.querySelectorAll(".menu__item");

	const buttonList = () => {
		buttonBurger.addEventListener("click", () => {
			buttonBurger.classList.toggle("active");
			burgerMenu.classList.toggle("active");
			spanBtnBurger.classList.toggle("active");
		});
	};

	buttonList();

	menuItems.forEach((item) => {
		item.addEventListener("click", () => {
			burgerMenu.classList.remove("menu__burger--active");

			menuItems.forEach((item) => item.classList.remove("menu__item--active"));

			item.classList.add("menu__item--active");

			const contentTitle = item.querySelector(".menu__item-text").textContent;

			if (contentTitle === "Customers") {
				fetchData();
			} else {
				dynamicContent.innerHTML = `<h2 class="dynamic_content__title">${contentTitle}</h2>`;
			}

			if (
				buttonBurger.classList.contains("active") &&
				spanBtnBurger.classList.contains("active") &&
				burgerMenu.classList.contains("active")
			) {
				buttonBurger.classList.remove("active");
				burgerMenu.classList.remove("active");
				spanBtnBurger.classList.remove("active");
			}
		});
	});
});
