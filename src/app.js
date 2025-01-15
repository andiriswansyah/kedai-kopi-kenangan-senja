document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 20000 },
            { id: 2, name: 'Arabica Blend', img: '2.jpg', price: 25000 },
            { id: 3, name: 'Primo Passo', img: '3.jpg', price: 30000 },
            { id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 35000 },
            { id: 5, name: 'Sumatra Mandheling', img: '5.jpg', price: 40000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add( newItem) {
            // cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            //jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada
                this.items = this.items.map((item) => {
                    //jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada add item
                        item.quantity++
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
            console.log(this.total);
        },
        remove(id) {
            //ambil item yang mau di remove
            const cartItem = this.items.find((item) => item.id === id);

            //jika item lebih dari satu
            if(cartItem.quantity > 1) {
                //telusuri 11
                this.items = this.items.map((item) => {
                    // jika bukan barang yang di klik 
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});

// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disable = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for (let i = 0; i < form.nextElementSibling.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disable');
            checkoutButton.classList.add('disable');
        } else {
            return false;
        }
    }
    checkoutButton.disable = false;
    checkoutButton.classList.remove('disable');
});

// kirim data ketika tombol checkout  di klik
checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/6285159596533?text=' + encodeURIComponent(message));
});

//format pesan whatshapp
const formatMessage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        No HP: ${obj.phone}
    Data Pesanan
        ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
        
    TOTAL: ${rupiah(obj.total)}
    Terima Kasih.`;
}


// konversi mata uang rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};