# Start Service

## Start Service
```shell
docker-compose build
docker-compose up 
```
Default on http://localhost:3000

## API Space
### 1. Create User

call APIs
Method `Post` => Path "/user"

```json
{
    "username":"robo8",
    "password":"123123",
    "firstName":"robo8",
    "display_name":"robo8",
    "lastName":"QA",
    "email":"Joanny_Lang76@gmail.com",
    "status":1
}
```

### 2. Login

call APIs
Method `Post` => Path "/auth"

```json
{
    "username":"robo8",
    "password":"123123"
}
```
will response like this
```json
{
    "msgRes": {
        "msgCode": "0000",
        "msgDesc": "Success"
    },
    "userInfo": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjgsImVtYWlsIjoiQ2FtcnluMTZAZ21haWwuY29tIiwiZGlzcGxheV9uYW1lIjoicm9ibzgiLCJleHAiOjE3MDI1ODA3MDAsImlhdCI6MTcwMjQ5NDMwMCwidGltZV9zdGFtcCI6MTcwMjQ5NDMwMDIyMX0.5a5urDlgez5ow7WEoKLj-Aojpsmt8KjsB50s-W9hEa0",
        "expire_at": 1702580700,
        "username": "robo8"
    }
}
```

เก็บข้อมูล JWT Token จากข้อที่ 2 ไว้ใช้ใน APIs ถัดไป

### 3. Lists Card
call APIs
Method `GET` => Path "/cards?limit=&page="

Header `Authorization`: JWT TOKEN

limit ถ้าไม่ใส่จะมีค่าเริ่มต้นคือ 10
page ถ้าไม่ใส่จะมีค่าเริ่มต้นคือ 1


### 4. Create Card (สร้าง card)
call APIs
Method `Post` => Path "/card"

Header `Authorization`: JWT TOKEN

body 
```json
{
    "title":"นัดสัมภาษณ์งาน 4",
    "detail":"TESt Input more data"
}
```
ไม่ต้องใส่ status เพราะจะมี default = 1 (to do)


### 5. Card Detail 
call APIs
Method `Post` => Path "/card/:cardId"

Header `Authorization`: JWT TOKEN


### 6. Update Card (แก้ไข card)
call APIs
Method `PUT` => Path "/card/:cardId"

cardId = id ของ card ที่ต้องการแก้ไขข้อมูล

Header `Authorization`: JWT TOKEN

body 
```json
{
    "title":"นัดสัมภาษณ์งาน 4",
    "detail":"TESt Input more data",
    "status":1
}
```
สามารถใส่ status เข้ามาเพื่อเปลี่ยน status ของ card ได้
status 1 = To Do, 2 = In Progress, 3 = Done


### 7. Archive Card (จัดเก็บ card)
call APIs
Method `Patch` => Path "/card/:cardId"

Header `Authorization`: JWT TOKEN

### 8. Change Log of Card
call APIs
Method `GET` => Path "/card/:cardId/history"

cardId = id ของ card ที่ต้องการดึงข้อมูลการแก้ไข

Header `Authorization`: JWT TOKEN

### 9. Comment card
call APIs
Method `POST` => Path "/card/:cardId/comment"

cardId = id ของ card ที่ต้องการ comment

Header `Authorization`: JWT TOKEN

body
```json
{
    "comment":"Test Comment RRRRR"
}
```

### 10. Comment card Lists
call APIs
Method `GET` => Path "/card/:cardId/comment"

cardId = id ของ card ที่ต้องการดึงข้อมูล comment

Header `Authorization`: JWT TOKEN


### 11. Update Comment card
call APIs
Method `GET` => Path "/card/:cardId/comment/:commentId"

cardId = id ของ card 
commentId = id ของ comment ที่ต้องการแก้ไขข้อมูบ

Header `Authorization`: JWT TOKEN

```json 
{
    "comment":"Test Comment"
}
```


### 12. Delete Comment card
call APIs
Method `DELETE` => Path "/card/:cardId/comment/:commentId"

cardId = id ของ card 
commentId = id ของ comment ที่ต้องการลบ

Header `Authorization`: JWT TOKEN


## Data Dictionary
### 1. Users

field | Data Type | Length | Comment |
--- | --- | --- | --- |
uid | integer |  |  | 
username | varchar | 100 | |
password | varchar | 255 | bcrypt |
display_name | varchar | 100 | |
email | varchar | 255 | |
status | tinyint | 1 | 1=active,0=inacive|
create_datetime | datetime | | |
create_by_uid | integer |  | |
update_datetime | datetime | | |
update_by_uid | integer |  | |
is_delete | tinyint|1|1=delete,0=not delete
delete_datetime | datetime | | |
delete_by_uid | integer |  | |

### 2. Task (Card)

field | Data Type | Length | Comment |
--- | --- | --- | --- |
t_id | integer |  |  | 
title | varchar | 100 | |
detail | text | 255 | |
status | tinyint | 1 | 1=active,0=inacive|
archive | tinyint | 1 | 0=not archive, 1=archive|
create_datetime | datetime | | |
create_by_uid | integer |  | |
update_datetime | datetime | | |
update_by_uid | integer |  | |
archive_datetime | datetime | | |

### 3. Task ChangeLogs (Card)

field | Data Type | Length | Comment |
--- | --- | --- | --- |
change_id | integer |  |  | 
t_id | integer |  | |
old_title | varchar | 100 | |
new_titel | varchar | 100 | |
old_detail | text | | |
new_detail | text | | |
old_status | integer | | |
new_status | integer | | |
change_by_uid | integer |  | |
change_datetime | datetime | | |

### 3. Task Comment (Card)

field | Data Type | Length | Comment |
--- | --- | --- | --- |
tc_id | integer |  |  | 
t_id | integer |  |  | 
comment | text | 100 | |
create_datetime | datetime | | |
create_by_uid | integer |  | |
update_datetime | datetime | | |
is_delete | tinyint | | |
delete_datetime | datetime | | |
