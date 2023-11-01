import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Linking } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Card } from "react-native-paper";
// import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { faEarthEurope, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // console.log(data);
  const getArticles = () => {
    if (loading) {
      return;
    }
    setLoading(true)
    var url =
    "https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=20&apiKey=1f804abc9bf5432db60cbe929928d81f";
    let urlStr = `${url}&page=${page}`;
    if (searchQuery != '') {
      url = 
      "https://newsapi.org/v2/everything?apiKey=55c250f06e1144c29a3ec4d2530adbe5&language=en&q=";
      urlStr = `${url}${searchQuery}`;
    }
    console.log(page)
    console.log(url)
    console.log(urlStr);
    fetch(urlStr)
    .then((res) => res.json())
    .then((json) => {
      if (json.articles.length !== 0) {
      // Filter out articles with null or non-existent urlToImage
      const validArticles = json.articles.filter(article => article.urlToImage);
      setData((prevArticles) => [...prevArticles, ...validArticles]);
      setPage(page + 1);
      setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
  };
  
  const textInputRef = useRef(null);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      // If the search bar is becoming visible, focus on the input
      textInputRef.current.focus();
    }
  };
  
  const handleSearchEnter = () => {
    setSearchQuery(searchText); // Store the search query
    // Reset the articles and fetch with the new query
    setData([]);
    setPage(1);
    // getArticles();
  };
  
  const handleHomeButton = () => {
    if (searchQuery != '') {
      setSearchQuery('');
      setData([]);
      setPage(1);
      setSearchText("Search");
      setSearchVisible(!searchVisible);
    }
  }

  const handleScrollEnd = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
  
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // User has scrolled to the end, load more articles
      getArticles();
    }
  };

  useEffect(() => {
    getArticles();
  }, [searchQuery]);
  return (
    <>
      <View style={{backgroundColor: "#262A10"}}>
      <View style = {{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '10%',
        marginBottom: '10%',
        flexDirection: 'row',
        backgroundColor: "black",
        zIndex: 1,
      }}>
      <TouchableOpacity onPress={handleHomeButton} style={{flexDirection: 'row'}}>
      <FontAwesomeIcon icon={faEarthEurope} size={24} color="white" style = {{ top: 50, marginLeft: 20}} />
      <Text style = {{color: 'white', fontSize: 18, marginLeft: 10, top: 50,}}>UnifyNews</Text>
      </TouchableOpacity>
      {searchVisible && (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', width: '10%'}}>
        <TextInput
        ref={textInputRef}
        style={{color: 'black', backgroundColor: 'white', fontSize: 14, marginLeft: 110, top: 20, width: '50%', height: '25%'}}
        placeholder="Search..."
        placeholderTextColor="black"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        onSubmitEditing={handleSearchEnter}
        />
        </View>
        )}
        <TouchableOpacity onPress={toggleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="white" style = {{ top: 50, right: -240,position: 'absolute'}}/>
        </TouchableOpacity>
      </View>
      {Object.keys(data).length > 0 && (
        <ScrollView
        style={{backgroundColor: "#0c2034", marginTop: 90}}
        onScrollEndDrag={handleScrollEnd}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              margin: 5,
            }}
          >
            {data.map((article, index) => (
              <Card key={index} style={{backgroundColor: "#303958", margin: 10,  width: "95%"}} onPress = {() => {
                Linking.openURL(article.url);
              }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{fontSize: 18, fontWeight: "bold", flex: 1, color: "white", marginHorizontal: 10}}>
                    {article.title}
                  </Text>
                  <TouchableOpacity 
                  onPress = {() => {
                    Linking.openURL(article.url);
                  }}>
                    <Image
                      source={{ uri: article.urlToImage }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 10,
                        marginRight: 13
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 16, color: "white", marginHorizontal: 10, marginBottom: 12, }}>{article.description}</Text>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
      </View>
    </>
  );
}