import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";

// AsyncStorage 저장 key
const STORAGE_KEY = "@todos";
const MENU_KEY = "@menus";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const travel = () => {
    setWorking(false);
    saveMenu(false);
  };
  const work = () => {
    setWorking(true);
    saveMenu(true);
  };
  // 사용자 입력 시
  const onChangeText = (payload) => setText(payload);

  // 사용자가 입력한 todo AsyncStorage 저장 함수
  const saveTodos = async (toSave) => {
    try {
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem(STORAGE_KEY, s);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // 사용자가 입력한 todo AsyncStorage 로드 함수
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    // todo가 null일 때 오류 방지
    s !== null ? setTodos(JSON.parse(s)) : null;
  };

  // 사용자가 마지막으로 클릭한 menu AsyncStorage 저장 함수
  const saveMenu = async (sign) => {
    try {
      const s = JSON.stringify(sign);
      await AsyncStorage.setItem(MENU_KEY, s);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // 사용자가 마지막으로 클릭한 menu AsyncStorage 로드 함수
  const loadMenu = async () => {
    const s = await AsyncStorage.getItem(MENU_KEY);
    // null일 때 오류 방지
    if (s !== null) {
      setWorking(JSON.parse(s));
    }
  };

  useEffect(() => {
    loadTodos();
    loadMenu();
  }, []);

  // todo 추가 함수
  const addTodo = async () => {
    if (text === "") {
      return;
    }

    // 날짜를 key값으로 정함
    const newTodos = { ...todos, [Date.now()]: { text, work: working } };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  // todo 삭제 함수
  const deleteTodo = (id) => {
    // 삭제 전 alert
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "cancel" },
      {
        text: "ok",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
    return;
  };

  return (
    // 헤더
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      {/* input form */}
      <TextInput
        value={text}
        placeholder={working ? "Add a TO DO" : "Where do you want to go?"}
        style={styles.input}
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        returnKeyType="done"
      />

      {/* todo list */}
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].work === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={18} color="black" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: 600,
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
});
