#1. Lenh nay chi chay lan dau de khoi tao kho init
#git init

#2.Tao file .gitignore de bo qua cac thu muc, file khong truyen len server:
#Dac biet la cac thu vien cua phan mem se khong tuong thich tu may nay sang may khac


#3. Kiem tra git remote den bao nhieu server:
#git remote -v

#4. Neu chua dang ky server buoc 3 thi tao key de login vao git server
#ssh-keygen -t rsa -C "Key cua Cuongdq"

#5. sau khi co key, gui public_key (file co ten duoi .pub) gui lenh server addmin de gan

#6 dang ky dia chi git de lien lac
#git remote add origin git@10.151.54.84:/mnt/gitserver/ionic-mf3-gate-web.git

#7. Kiem tra lai dia chi da dang ky thanh cong hay khong
#git remote -v



#8. Lenh <git add .> nay bo sung cac file vao kho git de chuan bi commit
#luon luon duoc chay truoc khi gui du lieu len server
git add .
#9. lenh <git commit ...> thuc hien commit
git commit -m "cuongdq push to c3 by sh"

