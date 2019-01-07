'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 5,
  'time' : 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function fetchBarById(id)
{
  let barFound = false;
  let i = 0;
  var result = null;
  while (barFound===false && i<bars.length)
  {
    if (id===bars[i].id)
    {
      barFound = true;
      result = bars[i];
    }
    i = i + 1;
  }
  return result;
}

function fetchEventById(id)
{
  let eventFound = false;
  let i = 0;
  var result = null;
  while (eventFound===false && i<events.length)
  {
    if (id===events[i].id)
    {
      eventFound = true;
      result = events[i];
    }
    i = i + 1;
  }
  return result;
}

function generateBookingPrice()
{
  for (var i=0;i<events.length;i++)
  {
    let bar = fetchBarById(events[i].barId);
    if (bar != null)
    {
      var price = 0;
      //events[i].price = events[i].time*bar.pricePerHour + events[i].persons*bar.pricePerPerson;
      for (var j=1;j<=events[i].time;j++)
      {
        if (j >= 60)
        {
          price = price + bar.pricePerHour - bar.pricePerHour*0.5;
        }
        else
        {
          if (j >= 20)
          {
            price = price + bar.pricePerHour - bar.pricePerHour*0.3;
          }
          else
          {
            if (j >= 10)
            {
              price = price + bar.pricePerHour - bar.pricePerHour*0.1;
            }
            else
            {
              price = price + bar.pricePerHour;
            }
          }
        }
      }
      var deductible = 0;
      if (events[i].options.deductibleReduction===true)
      {
        deductible = 200 + events[i].persons;
      }
      else
      {
        deductible = 5000;
      }
    }
    events[i].price = price + deductible;
    var commission = 0.3*price;
    events[i].commission.insurance = commission*0.5;
    events[i].commission.treasury = events[i].persons;
    events[i].commission.privateaser = commission - commission*0.5 - events[i].persons + deductible;
  }
}

function payActors()
{
  for (var i=0;i<actors.length;i++)
  {
    var evnt = fetchEventById(actors[i].eventId);
    if (evnt != null)
    {
      for (var j=0;j<actors[i].payment.length;j++)
      {
        /*
        if (actors[i].payment[j].who === 'booker')
        {
          actors[i].payment[j].amount = evnt.price;
        }
        if (actors[i].payment[j].who === 'bar')
        {
          actors[i].payment[j].amount = evnt.price - evnt.price*0.3;
        }
        if (actors[i].payment[j].who === 'insurance')
        {
          actors[i].payment[j].amount = evnt.commission.insurance;
        }
        if (actors[i].payment[j].who === 'treasury')
        {

        }
        */
        switch (actors[i].payment[j].who)
        {
          case 'booker':
          {
            actors[i].payment[j].amount = evnt.price;
            break;
          }
          case 'bar':
          {
            if (evnt.options.deductibleReduction === true)
            {
              actors[i].payment[j].amount = evnt.price - 200 - evnt.persons - (evnt.price - 200 - evnt.persons)*0.3;
            }
            else
            {
              actors[i].payment[j].amount = evnt.price - 5000 - (evnt.price - 5000)*0.3;
            }
            break;
          }
          case 'insurance':
          {
            actors[i].payment[j].amount = evnt.commission.insurance;
            break;
          }
          case 'treasury':
          {
            actors[i].payment[j].amount = evnt.commission.treasury;
            break;
          }
          case 'privateaser':
          {
            actors[i].payment[j].amount = evnt.commission.privateaser;
            break;
          }
        }
      }
    }
  }
}

generateBookingPrice();
payActors();
console.log(events);
console.log(actors);