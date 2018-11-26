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

####### Trường hợp đã có đăng ký một địa chỉ git khác cần thay đổi??
# Gõ lệnh > git remote set-url origin <địa chỉ mới>
git remote set-url origin git@10.151.54.84:/mnt/gitserver/ionic-mf3-gate-web.git

#7. Kiem tra lai dia chi da dang ky thanh cong hay khong
#git remote -v


#8. Lenh <git add .> nay bo sung cac file vao kho git de chuan bi commit
#luon luon duoc chay truoc khi gui du lieu len server
git add .
#9. lenh <git commit ...> thuc hien commit
git commit -m "cuongdq push to c3 by sh"

#10. day source len server
git push origin master

#11. Gõ mật khẩu của user git khi yêu cầu hỏi?? Admin@12345


################################################################
# Để copy về máy khi chưa đăng ký dịch vụ, chỉ cần lệnh git clone địa chỉ
# Để đồng bộ về máy khi đã đăng ký remote chỉ cần gõ lệnh git pull

