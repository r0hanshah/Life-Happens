import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Linking } from 'react-native';

import TaskModel from "../../models/TaskModel";
import MainController from "../../controllers/main/MainController";

const ExtraMediaSection: React.FC<{task: TaskModel, isLeft: Boolean, fontsLoaded: boolean, mainController: MainController}> = ({task, isLeft, fontsLoaded, mainController}) => {
    
    const [urls, setUrls] = useState<string[]>(task.extraMedia);
    const [urlText, setUrlText] = useState('');

    const [urlsMetadata, setUrlsMetadata] = useState<{ title: string; description: string; image: string; url:string}[] | null>([]);

    useEffect(() => {
        setUrls(task.extraMedia);

        const fetchUrlsMetadata = async () => {

            const urlsMetadata = await Promise.all(task.extraMedia.map(fetchMetadata));

            if(urlsMetadata == null)
            {
                setUrlsMetadata(null)
                return
            }

            const extractedData = urlsMetadata.map(metadata => (
            {
              title: metadata.data.title,
              description: metadata.data.description,
              image: metadata.data.logo.url, 
              url: metadata.data.url
            }));

            setUrlsMetadata(extractedData);
        };
        
        fetchUrlsMetadata();
      }, [task.extraMedia]);

    const isValidUrl = (url:string) => {
        try {
        new URL(url);
        return true;
        } catch (error) {
        return false;
        }
    };

    const handleAddMedia = () => {
        if (isValidUrl(urlText)) {
        setUrls([...urls, urlText]);
        task.extraMedia = [...urls, urlText]
        setUrlText('');
        mainController.saveEditToTask(task)
        } else {
        alert('Invalid URL');
        }
    };

    const handleDeleteMedia = (urlToDelete:string) => {
        const filteredUrls = urls.filter(url => url !== urlToDelete)
        setUrls(urls.filter(url => url !== urlToDelete))
        task.extraMedia = filteredUrls
        if (urlsMetadata)
        {
            setUrlsMetadata(urlsMetadata!.filter(data => data.url !== urlToDelete))
        }
        mainController.saveEditToTask(task)
    }

    return (
        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Extra Media</Text>
            {/* Display list of items */}
            <View style={{width:"100%", backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, marginTop:10, padding:10, justifyContent:'flex-start'}}>
                <View style={{marginTop: 10, width:'100%', borderBottomColor:'white', borderBottomWidth:2, paddingBottom:20}}>
                    {urlsMetadata && urlsMetadata.length > 0 && 
                        urlsMetadata.map((item, index) => (
                            <View style={{justifyContent:'center'}}>
                                <TouchableOpacity key={urls[index]} style={{flexDirection:'row', padding:5, margin:5, width:200}} onPress={() => Linking.openURL(urls[index])}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ width: 100, height: 100, borderRadius:10, marginRight: 10}} // Adjust the dimensions as needed
                                    />
                                    <View style={{flexDirection:'column'}}>
                                        <Text numberOfLines={2} style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:15, color:'white', width:300,}}>{item.title}</Text>
                                        <Text style={{color:'gray', width:300, height:75, overflow:'hidden'}}>{item.description}</Text>
                                    </View>
                                    
                                </TouchableOpacity>
                                <TouchableOpacity style={{position:'absolute', backgroundColor:"#151515", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', right:10}} onPress={()=>{handleDeleteMedia(item.url)}}>
                                    <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    {(!urlsMetadata ||( urlsMetadata.length == 0 && urls.length > 0 )) &&
                        urls.map((item, index) => (
                            <View>
                                <Text key={index} style={{color:'white', paddingBottom: 10}}>{item}</Text>
                                <TouchableOpacity style={{position:'absolute', backgroundColor:"#151515", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', right:-10}} onPress={()=>{handleDeleteMedia(item)}}>
                                    <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                </TouchableOpacity>
                            </View>
                            
                        ))
                    }
                </View>
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
                    <TextInput
                        style ={{color:"white", width:'95%'}}
                        onChangeText={setUrlText}
                        value={urlText}
                        placeholder="Enter URL here..."
                    />
                    <TouchableOpacity onPress={handleAddMedia}>
                        <Image
                            style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}], margin:5}}
                            source={require('../../assets/x_mark_white.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    );
}

const fetchMetadata = async (url:string) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

export default ExtraMediaSection;