import React, { Component, useState,useEffect } from 'react'
import Icon from 'react-native-vector-icons/Feather';
import SearchableDropdown from 'react-native-searchable-dropdown';
function SelectTwo({items,selectedItem,handleId,placeholder,
  width,name,i,handleProduct,defaultValue,product,borderColor}) {

    
const[selectedItems,setSelectedItems]=useState(selectedItem)

    return (
      <SearchableDropdown
      name={name}
      multi={false}
      selectedItems={selectedItems[selectedItems.length-1]}
      onItemSelect={(item) => {
        const items = selectedItems;
        items.push(item)
        product?handleId(item.id,product,i):handleId(item)
        product?handleProduct(item.id,i,name,product):console.log("")
        setSelectedItems(items);
      }}
      containerStyle={{ padding: 5 ,flex:0.98,width:width}}
    
      itemStyle={{
        padding: 10,
        marginTop: 2,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
        
      }}
      itemTextStyle={{ color: '#222' }}
      itemsContainerStyle={{ maxHeight: 150,}}
      items={items}
  
      chip={true}
      resetValue={false}
      textInputProps={
        {
          placeholder: placeholder,
          underlineColorAndroid: "transparent",
          style: {
              
              padding: 5,
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 5,
            
              
          },
          defaultValue:defaultValue
      
        }
      }
      listProps={
        {
          nestedScrollEnabled: true,
        }
      }
    />
         )
}

export default SelectTwo
