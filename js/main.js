
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ 'line-through': !inStock }">Out of Stock</p>
            <ul>
                <p style="font-size: 20px">Состав</p>
                <product-details></product-details>
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <div v-for="(variant, index) in variants" :key="variant.variantId"
                 class="variant" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
            </div>
            <ul>
                <li v-for="size in sizes" >{{ size }}</li>
            </ul>
            <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button @click="decreaseCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Delete</button>
        </div>
        <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: 'sale',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            // Загрузка из localStorage
            reviews: JSON.parse(localStorage.getItem('productReviews') || '[]')
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        decreaseCart() {
            this.$emit('delete-to-cart', this.variants[this.selectedVariant].variantId);
        },
        addReview(productReview) {
            this.reviews.push(productReview);
            this.saveReviewsToStorage();
        },
        saveReviewsToStorage() {
            localStorage.setItem('productReviews', JSON.stringify(this.reviews));
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product} ${this.onSale}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            return this.premium ? 'Free' : '2.99';
        }
    },
    watch: {
        reviews: {
            deep: true,
            handler() {
                this.saveReviewsToStorage();
            }
        }
    }
});

Vue.component('product-details', {
    template: `
        <ul>
            <li v-for="detail in details" >{{ detail }}</li>
        </ul>
   `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral']
        }
    }
})
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
         <label for="rating">Rating:</label>
         <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
         </select>
      </p>
      <label for="recommend" >Would you recommend this product?</label><br>
             <input type="radio" id="yes" name="recommend" value="yes">
             <label for="yes" >Yes</label><br>
             <input type="radio" id="no" name="recommend" value="no">
             <label for="no" >No</label><br>
      <p>
        <input type="submit" value="Submit">
      </p>
</form>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommended: null,
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend !== null) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if (this.recommend === null) this.errors.push("Recommendation required.")
            }
        }
    }
})
Vue.component('product-tabs', {
    template: `
    <div>
      <ul>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab">{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Отзывы'">
        <!-- Добавлен фильтр по оценке -->
        <select v-model="selectedRatingFilter" class="filter-select">
          <option value="all">Все отзывы</option>
          <option v-for="n in 5" :key="n" :value="n">Оценка {{ n }}</option>
        </select>
        <p v-if="filteredReviews.length === 0">Отзывов по данному фильтру нет.</p>
        <ul>
          <li v-for="review in filteredReviews">
            <p>{{ review.name }}</p>
            <p>Оценка: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
      <div v-show="selectedTab === 'Оставить отзыв'">
        <product-review @review-submitted="addReview"></product-review>
      </div>
      <div v-show="selectedTab === 'Shipping'">
        <p>Стоимость доставки: {{ shipping }}</p>
      </div>
      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
    </div>
  `,
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tabs: ['Отзывы', 'Оставить отзыв', 'Shipping', 'Details'],
            selectedTab: 'Отзывы',
            selectedRatingFilter: 'all' // Новое состояние для фильтрации
        };
    },
    computed: {
        // Фильтруем отзывы по выбранной оценке
        filteredReviews() {
            if (this.selectedRatingFilter === 'all') {
                return this.reviews;
            } else {
                return this.reviews.filter(review =>
                    review.rating === parseInt(this.selectedRatingFilter)
                );
            }
        }
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        inStock:true,
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart() {
            if (this.cart.length <= 0) {
                return this.cart.length;
            } else
                this.cart.splice(this.cart.length -1,1);
        }
    }
})
    `
})

`