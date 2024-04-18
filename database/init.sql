-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(16) UNIQUE NOT NULL,
    passwd_hash VARCHAR(100) NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (username)
);

-- Create the chats table
CREATE TABLE IF NOT EXISTS chats (
    chat_id SERIAL PRIMARY KEY,
    friendname VARCHAR(16) NOT NULL,
    ownername VARCHAR(16) NOT NULL,
    last_message_id INT,
    read_status BOOLEAN
);
