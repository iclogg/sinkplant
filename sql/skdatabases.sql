    
    
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profileUrl TEXT 
);

    CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(255) NOT NULL, 
    creator INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    groupBio TEXT
);

    /* reset frequency? */
    /* done bolean? prob not*/


    CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(10) NOT NULL,
    taskDescription VARCHAR(255),
    assigned_user INT,
    done BOOLEAN DEFAULT false 
);


    CREATE TABLE subtasks (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    task_id INT NOT NULL REFERENCES tasks(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    taskDescription TEXT,
    done BOOLEAN DEFAULT false
);

    CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    member_id INT REFERENCES users(id) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted BOOLEAN DEFAULT false
);

    CREATE TABLE assignment(
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    user_id INT REFERENCES users(id) NOT NULL,
    task_id INT NOT NULL REFERENCES tasks(id),
    week INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    done BOOLEAN DEFAULT false
);

CREATE TABLE assignment(
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    user_id INT REFERENCES users(id) NOT NULL,
    task_id INT NOT NULL REFERENCES tasks(id),
    week INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    done BOOLEAN DEFAULT false
);



/* nice to have if time:
    a table for statistic
    ads each time all tasks are successfully ticked off. 
    ads at end of week if not all was ticked off.

 */