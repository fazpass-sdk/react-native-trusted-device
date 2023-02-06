import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
      },
      loading: {
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      title: {
        textAlign: 'center',
        marginVertical: 8,
        fontWeight:'bold',
        color:'#000000'
      },
      button: {
        borderRadius:8,
        margin:8
      },
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      input:{
        borderRadius:3,
        borderWidth: 1,
        padding: 10,
        borderColor:'#737373',
        color:'#000000'
       
      },
      tinyLogo: {
        width:250,
        height:175,
        borderRadius:10,
        alignSelf:'center'
      },
      footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom:32
      },
      text_banner:{
        flex:1,
        textAlign:'justify'
      }
})