package com.example.chat.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomMemberId implements Serializable {

    private Room room;
    private Integer userId;
}
