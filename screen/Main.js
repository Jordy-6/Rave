import Rave from "./Rave";
import Record from "./Record";
import { useWindowDimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { useState } from "react";

export default function Main() {

    const renderScene = SceneMap({
        first: Record,
        second: Rave,
    });

    const layout = useWindowDimensions();
    
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Record' },
        { key: 'second', title: 'Rave' },
    ]);   

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout }}
        />
    );
}

