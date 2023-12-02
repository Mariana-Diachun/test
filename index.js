const productsListElement = document.querySelector(".products-list");

function groupArraysByProperties(products) {
  const groupedArrays = {};
  products.forEach((item) => {
    const key = `${item.productId}_${item.name}_${item.color}`;
    if (!groupedArrays[key]) {
      groupedArrays[key] = [];
    }
    groupedArrays[key].push(item);
  });

  const groupedItems = Object.values(groupedArrays);
  return groupedItems;
}

fetch("https://storage.googleapis.com/hush-dev-public/hush.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const products = data;

    const groupedData = groupArraysByProperties(products);

    const calculatePriority = (tile) => {
      const sumOfPriorities = tile.reduce(
        (total, obj) => total + obj.priority,
        0
      );
      const avaragePrioritie = sumOfPriorities / tile.length;
      const sizesCount = tile.length;
      const priorityTileValue = Math.floor(avaragePrioritie * sizesCount);

      return priorityTileValue;
    };

    const displayedProducts = groupedData.sort((a, b) => {
      const priorityA = calculatePriority(a);
      const priorityB = calculatePriority(b);
      return priorityB - priorityA;
    });

    const defineImageWidth = (width) => {
      return width >= 200 && width <= 290;
    };

    const result = displayedProducts
      .filter((group) => {
        return defineImageWidth(group[0].imageWidth);
      })
      .forEach((group) => {
        const product = {
          name: group[0].name,
          availableSizes: group.map((product) => product.size),
          price: `${group[0].priceObj.value}`,
          image: group[0].image,
          imageAlt: group[0].imageAlt,
        };
        const productHTML = `
          <li style="flex: 0 0 auto; width: 290px; border: 1px solid #ccc; padding: 10px; scroll-snap-align: start; position: relative;">
            <img src="${product.image}" alt="${product.imageAlt}">
            <p> ${product.name}</p>
            <p>£ ${product.price}</p>
            <p style="position: absolute; bottom: 90px; right: 10px; font-weight: bold;">Available Sizes: ${product.availableSizes.join(
              ", "
            )}</p>
          </li>
        `;
        productsListElement.insertAdjacentHTML("beforeend", productHTML);
      });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

const scrollLeftButtonEl = document.getElementById("scroll-left");
const scrollRightButtonEl = document.getElementById("scroll-right");

scrollLeftButtonEl.addEventListener("click", () => {
  productsListElement.scrollBy({
    left: -200,
    behavior: "smooth",
  });
});

scrollRightButtonEl.addEventListener("click", () => {
  productsListElement.scrollBy({
    left: 200,
    behavior: "smooth",
  });
});
