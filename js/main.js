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

<p>User is premium: {{ premium }}</p>
<p>Shipping: {{ shipping }}</p>
<div v-for="(variant, index) in variants" :key="variant.variantId"
class="variant" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
    </div>
<ul>
    <li v-for="size in sizes" >{{ size }}</li>
</ul>
<div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            <button v-on:click="addToCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="decreaseCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Delete</button>
        </div>
    </div>
`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: 'sale',
            selectedVariant: 0,
            altText: "A pair of socks",
            inStock: true,
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
            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);
            },
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        decreaseCart() {
            if (this.cart > 0) {
                this.cart--;
            }
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product + ' ' + this.onSale;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }

})

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
let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})
    `
})

`