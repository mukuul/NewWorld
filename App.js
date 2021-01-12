import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, 
  StatusBar, ActivityIndicator, TextInput, Button, Image, BackHandler } from 'react-native';
import { SvgUri } from 'react-native-svg';
const { fetchCountries, fetchCountry } = require('./fetchCountryData')



const App = () => {
  const [ displayData, setdisplayData ] = useState([{name:""}]);
  const [text, setText] = useState('');
  const [ country, setCountry ] = useState(null)
  const initialCountryState = {
    name: "",
    flagUrl: "",
    capital: '',
    region: '',
    subregion: '',
    population: 0,
    timezones: [""],
  }
  const [ countryData, setCountryData ] = useState(initialCountryState)
  const [isLoading, setLoading] = useState(true);
  function handleBackButtonClick() {
    setCountry(null);
    return true;
  }

  const Item = ({ name }) => (
    <View style={styles.item}>
      <Text 
        onPress= {()=>{setCountry(name)}}
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
    .then((res=>{
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
      const ac = new AbortController();
      fetchCountry(country)
      .then(data => {
        if(country) {
          let countryObj = {
            name: country,
            flag: data.flag,
            capital: data.capital,
            region: data.region,
            subregion: data.subregion,
            population: data.population,
            timezones: data.timezones.join(', '),
            languages: data.languages.map(obj=>obj.name).join(', ')
          };
          setCountryData(countryObj)
        }
      })
      return () => ac.abort();
    }, [country]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        !country ?  (
          <View style={{ flex: 1, padding: 24 }}>
            <TextInput
            style={{height: 40}}
            placeholder="Search for country..."
            onChangeText={text => setText(text)}
            defaultValue={text} />
            <FlatList
            numColumns= {2}
            horizontal= {false}
            data={displayData.filter(arr => arr.name.toLowerCase().search(text.toLowerCase()) === 0)}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            />
          </View>
        ) : (
          <View 
            style={{
              flex:1,
              alignItems: 'center',
            }}
          >
            <View style={{flexDirection:'row',flex:0.5 }}>
              <Text style={{fontSize:30, fontWeight:"bold"}}>{countryData.name}</Text>
            </View>
            <View style={{ flex: 2, justifyContent:'center', aspectRatio:1 }}>
              <SvgUri flex='1' width="100%" height="100%" uri={countryData.flag} viewBox="0 0 400 400">
              </SvgUri>
            </View>
            <View style={styles.countryBox}> 
              <Text>Capital : {countryData.capital}</Text>
              <Text>Region : {countryData.region}</Text>
              <Text>Sub Region : {countryData.subregion}</Text>
              <Text>Population : {countryData.population}</Text>
              <Text>Languages : {countryData.languages}</Text>
              <Text>Time Zones : {countryData.timezones}</Text>
            </View>
            <Button
              title="Go Back"
              onPress={()=>{setCountry(null)}}
            />
          </View>
        )
      )}
    </SafeAreaView>
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
    flex: 3,
    backgroundColor:"powderblue",
    // justifyContent: 'center'
  }
});

export default App;