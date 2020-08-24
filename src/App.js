import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from "react-native";

import api from "./services/api";

export default function App() {
    const ONE_LIKE = 1;
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        api.get('repositories').then((response) => {
            setRepositories(response.data);
        })
    }, []);

    async function handleLikeRepository(id) {
        const response = api.post(`/repositories/${id}/like`);

        const updatedRepository = (await response).data;

        const repositoryIndex = repositories
            .findIndex((repository) => repository.id === updatedRepository.id);

        if (repositoryIndex === -1) {
            return;
        }

        const newArray = [...repositories];
        newArray[repositoryIndex] = updatedRepository;

        setRepositories(newArray);
    }

    const getLikeText = (likes) => likes > ONE_LIKE ? 'curtidas' : 'curtida';

    return (
        <>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={repositories}
                    keyExtractor={(repository) => repository.id}
                    renderItem={({ item: repository }) => (
                        <View style={styles.repositoryContainer}>
                            <Text style={styles.repository}>{repository.title}</Text>
                            <View style={styles.techsContainer}>
                                {repository.techs.map((tech => (
                                    <Text key={tech} style={styles.tech}>
                                        {tech}
                                    </Text>
                                )))}
                            </View>

                            <View style={styles.likesContainer}>
                                <Text
                                    style={styles.likeText}
                                    // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                                    testID={`repository-likes-${repository.id}`}
                                >
                                    {`${repository.likes} ${getLikeText(repository.likes)}`}
                                </Text>
                            </View>
        
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleLikeRepository(repository.id)}
                                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                                testID={`like-button-${repository.id}`}
                            >
                                <Text style={styles.buttonText}>Curtir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
