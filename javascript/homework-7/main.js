const express          = require('express');
const cors             = require('cors');
const { readFileSync } = require('fs');
const { buildSchema }  = require('graphql');
const graphqlHTTP      = require('express-graphql');

const schemaString = readFileSync('./schema.graphql', { encoding: 'utf8' });
const schema = buildSchema(schemaString);

const productTypes = [
    { code: 'tv', name: 'телевизор'},
    { code: 'mixer', name: 'миксер'},
];
const products = [
    {
        id: 1,
        name: 'Samsung UE55TU7097U',
        price: '59990',
        currency: '₽',
        type: 'tv',
        specifications: {
            diagonalValue: 55,
            diagonalUnit: '"'
        }
    },
    {
        id: 2,
        name: 'Samsung UE32N5000AU',
        price: '20990',
        currency: '₽',
        type: 'tv',
        specifications: {
            diagonalValue: 81.2,
            diagonalUnit: 'см'
        }
    },
    {
        id: 3,
        name: 'Goodhelper HM371',
        price: '20990',
        currency: '₽',
        type: 'mixer',
        specifications: {
            color: 'white'
        }
    }
];

const actions = {
    getTypes: function() {
        return productTypes;
    },
    getProducts: function(params) {
        return products.filter(function(record) {
            return record.type === params.type;
        });
    },
    setProduct: function(params) {
        let isOldProduct = false;
        for(var i=0; i<products.length; i++) {
            var product = products[i];
            if (product.id == params.product.id) {
                isOldProduct = true;
                break;
            }
        }
        if (isOldProduct) {
            products[i] = {...product, ...params.product};
        }
        else {
            params.product.id = params.product.id? params.product.id: Math.floor(Math.random() * 5000);
            products.push(params.product);
        }
        return true;
    },
    removeProduct: function(params) {
        for(var i=0; i<products.length; i++) {
            if (products[i].id == params.id) {
                products.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};

const app = express();
app.use(cors());

app.get('/page', function(req, res) {
    res.sendFile(__dirname + '/mypage.html');
});

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: actions,
        graphiql: true
    })
);

app.listen(3000, function() {
    console.log('Демонстрационная страница: http://localhost:3000/page');
});

