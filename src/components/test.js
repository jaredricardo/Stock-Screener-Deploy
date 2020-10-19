let dict = {
    art1: '2020-08-18',
    art2: '2020-08-11',
    art3: '2020-09-04',
    art4: '2020-09-12',
    art5: '2020-08-26',
    art6: '2020-09-01',
    art7: '2020-08-13',
    art8: '2020-09-27',
    art9: '2020-09-09',
    art10: '2020-09-08'
}

let dict2 = {
    art1: 3,
    art2: 6,
    art3: 4,
    art4: 53,
    art5: 1,
    art6: 10,
    art7: 44,
    art8: 19,
    art9: 9,
    art10: 100
}

let dict3 = {
    art1: {
        date: 3,
        dummyProp: 'fuck'
    },
    art2: {
        date: 9,
        dummyProp: 'fuck'
    },
    art3: {
        date: 90,
        dummyProp: 'fuck'
    },
    art4: {
        date: 1,
        dummyProp: 'fuck'
    },
    art5: {
        date: 35,
        dummyProp: 'fuck'
    },
    art6: {
        date: 12,
        dummyProp: 'fuck'
    },
    art7: {
        date: 32,
        dummyProp: 'fuck'
    },
    art8: {
        date: 2232,
        dummyProp: 'fuck'
    },
    art9: {
        date: 100,
        dummyProp: 'fuck'
    },
    art10: {
        date: -3,
        dummyProp: 'fuck'
    }
}



const mapSort = (obj) => {
    let items = Object.keys(obj).map((key) => {
        return [key, obj[key]]
    })
    items.sort(function(first, second) {
        return second[1] - first[1]
    })
    return items
}

