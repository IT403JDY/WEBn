#Setting for MAC
    우리과정에서는 비트나미를 통해하지만 진행자는 직접 아파치와 mriaDBㄹ를 설치하여 진행하겠다.
    우선 mac에는 아파치가 기본 설치되있다. 따라서 mariaDB만 설치 및 설정해준다.
    >>-Homebrew- 설치 공식 사이트에서 설명한 대로 설치하면된다.
    >>brew install mariaDB
    >> mysql.server start
    >> Error 발생 => mkdir /usr/local/etc/my.cnf.d 을 통해 오류 처릭 가능
    ->mysql -u root
    ->update user set password=password('리신콤보1234') where user='root';
    ->flush pribvileges;
    로 기본 설정을 마무리한다.

    apache 시작
    >>sudo apachectl start
    >>sudo apachectl stop
    -> 기본 인덱스 폴더 : /Library/WebServer/Documents/
    이것을 변경해 주어야 한다. 나는 특정 워크스페이스로 변경하여 index.html을 넣어 놓을 생각이다.
    >>sudo vi /etc/apache2/httpd.conf
    =>DocumentRoot "/Library/WebServer/Documents"
    <Directory "/Library/WebServer/Documents"
    => 나는 www파일을 기본 디렉토리로 설정하였다.
