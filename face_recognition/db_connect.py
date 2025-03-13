import pymysql

db = pymysql.connect(
    host='project-db-cgi.smhrd.com',
    port=3307,
    user='cgi_24K_AI4_p2_3',
    password='smhrd3',
    db='cgi_24K_AI4_p2_3',
    charset='utf8'
)

cursor = db.cursor(pymysql.cursors.DictCursor)
print(" MySQL 데이터베이스 연결 성공!")

# pip install pymysql
