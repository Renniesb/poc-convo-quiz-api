create table questions (
id Integer PRIMARY KEY GENERATED BY DEFAULT AS identity,
questiontype text not null,
answers text not null,
questionText text not null,
responseText text not null,
correctText text not null,
link text not null,
linktype text not null,
quiznum integer references quiz(id) on delete cascade not Null
) 