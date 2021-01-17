import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, FlatList, StyleSheet, Text,
  StatusBar, ActivityIndicator, TextInput, Button, Image, BackHandler
} from 'react-native';
import { SvgUri } from 'react-native-svg';
const { fetchCountries, fetchCountry } = require('./fetchCountryData')

const App = () => {
  const [displayData, setdisplayData] = useState([{ name: "" }]);
  const [text, setText] = useState('');
  const [country, setCountry] = useState(null)
  const initialCountryState = {
    name: "",
    flagUrl: "",
    capital: '',
    region: '',
    subregion: '',
    population: 0,
    area: 0,
    timezones: [""],
  }
  const [countryData, setCountryData] = useState(initialCountryState)
  const [isLoading, setLoading] = useState(true);

  function handleBackButtonClick() {
    setCountry(null);
    return true;
  }

  const Item = ({ name }) => (
    <View style={styles.item}>
      <Text
        onPress={() => { setCountry(name) }}
        style={styles.name}
      >
        {name}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item name={item.name} />
  );

  useEffect(() => {
    fetchCountries()
      .then((res => {
        setdisplayData(res);
      }))
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  useEffect(
    () => {
      let isMounted = true;
      const ac = new AbortController();
      fetchCountry(country)
        .then(data => {
          if (country && isMounted) {
            let countryObj = {
              name: country,
              flag: data.flag,
              capital: data.capital,
              region: data.region,
              subregion: data.subregion,
              currency: data.currencies.map(obj => obj.name).join(', '),
              population: parseFloat(data.population).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
              area: parseFloat(data.area).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
              timezones: data.timezones.join(', '),
              languages: data.languages.map(obj => obj.name).join(', '),
            };
            setCountryData(countryObj)
          }
        })
      return () => {
        isMounted = false;
      }
    }, [country]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        !country ? (
          <View style={{ flex: 1, padding: 24 }}>
            <TextInput
              style={{ height: 40 }}
              placeholder="Search for country..."
              onChangeText={text => setText(text)}
              defaultValue={text} />
            <FlatList
              numColumns={2}
              horizontal={false}
              data={displayData.filter(arr => arr.name.toLowerCase().search(text.toLowerCase()) === 0)}
              renderItem={renderItem}
              keyExtractor={item => item.name}
            />
          </View>
        ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', flex: 0.5 }}>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>{countryData.name}</Text>
              </View>
              <View style={{ flex: 2, justifyContent: 'center', aspectRatio: 1, }}>
                <SvgUri flex='1' width="100%" height="100%" uri={countryData.flag} viewBox="0 0 400 400">
                </SvgUri>
              </View>
              <View style={styles.countryBox}>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Capital : </Text>{countryData.capital} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Region : </Text>{countryData.region} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Sub Region : </Text>{countryData.subregion} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Currency : </Text>{countryData.currency} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Population : </Text>{countryData.population} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Area : </Text>{countryData.area} km<Text style={{ fontSize: 8, lineHeight: 22, textAlignVertical: 'top' }}>2</Text> </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Languages : </Text>{countryData.languages} </Text>
                <Text style={styles.name}><Text style={{ fontWeight: 'bold' }}> Time Zones : </Text>{countryData.timezones} </Text>
              </View>
              <Button
                title="Go Back"
                onPress={() => { setCountry(null) }}
              />
            </View>
          )
      )}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    flex: 1,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 4,
  },
  name: {
    fontSize: 16,
  },
  countryBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "powderblue",
    justifyContent: 'space-around',
    alignItems: 'stretch',

  }
});

export default App;