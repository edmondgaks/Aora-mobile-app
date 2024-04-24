import { Client, Account, ID, Avatars, Databases } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.edmond.aora",
    projectId: "6628b8a417a065680cb3",
    databaseId: "6628c49d399895333622",
    userCollectionId: "6628c4d312b94c32c27b",
    videoCollectionId: "6628c4feaf9eb84e4b68",
    storageId: "6628cb771594a1e5e9ce"
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

 
export const createUser = async (username, email, password) => {
    try {
        const newAccount = await account.create(ID.unique, username, email, password)
        if (!newAccount) throw new Error;

        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
              accountId: newAccount.$id,
              email: email,
              username: username,
              avatar: avatarUrl,
            }
          );
      
          return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);
        return session
    } catch (error) {
        throw new Error(error);
    }
}