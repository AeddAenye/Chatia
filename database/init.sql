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

CREATE TABLE .messages (
	message_id SERIAL PRIMARY KEY,
    ownername VARCHAR(16) NOT NULL,
    friendname VARCHAR(16) NOT NULL,
	chat_id int,
    message VARCHAR(1000) NOT NULL,
    send_time TIMESTAMP
);

