# Иснструкция по использованию

### 1. Клонируйте репозиторий

```bash
git clone [ssh_или_https_репозитория]
```
### 2. Запустите приложение
```bash
npm run start -- --username=your_username
```

### 3. Завершение Работы
Вы можете закрыть приложение двумя способами:

Введите команду .exit

Используйте комбинацию клавиш Ctrl + C (SIGINT)

В обоих случаях будет выведено прощальное сообщение: Thank you for using File Manager, <your_username>!.

### 4. Проверка работы команд осуществляется по описанию задания

```bash

ls
# Выведет список файлов и папок текущей директории

cd your_username
# Перейдёт в папку Documents

add myfile.txt
# Создаст новый файл myfile.txt

mkdir new_folder
# Создаст папку new_folder

rn oldfile.txt newfile.txt
# Переименует oldfile.txt в newfile.txt

cp file.txt new_folder
# Скопирует file.txt в папку backup

mv file.txt archive
# Переместит file.txt в папку archive

rm file.txt
# Удалит файл file.txt

hash myfile.txt
# Выведет SHA-256 хэш файла

compress myfile.txt myfile.br
# Сожмет myfile.txt и создаст myfile.br

decompress myfile.br myfile.txt
# Распакует myfile.br обратно в myfile.txt

os --(Предложенные флаги: --cpus, --homedir, --username, --architecture)
# Выведет информацию о процессорах системы
```
---
### 6. Если возникнут вопросы по запуску приложения - смело можно писать в


## Tg: @KirylZuyeu
## Discord: KirylZuyeu#1555
