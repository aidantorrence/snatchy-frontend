// If the sneaker is used, ask the following questions
// How many times has the sneaker been worn
// Are there scuff marks?
// Discoloration?
// Loose threads?
// Heel drag?
// Tough stains?

import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function QuestionsScreen({ navigation }: any) {
    return <SafeAreaView>
        <View>
            <Text>Number of times worn</Text>
            <Text>Scuff marks?</Text>
            <Text>Discoloration?</Text>
            <Text>Loose threads?</Text>
            <Text>Heel drag?</Text>
            <Text>Tough stains?</Text>
        </View>
    </SafeAreaView>
}
