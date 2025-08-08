# Unkeepdata & subscriptio

In the get users in the api slice we use    keepUnusedDataFor: 5, as a property within the slice

This means that get user retains a 5 seconds active subscription voor the get users and the the cache delete itself

THe solution is to make the users or notes application wide available with a active subscription: config > prefetch.js